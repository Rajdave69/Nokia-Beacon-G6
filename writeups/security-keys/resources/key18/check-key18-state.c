/* Report Nokia firmware-key availability without printing key/password data.
 * Queries stock APIs and file metadata; does not initialize a security database,
 * unwrap factory values, regenerate keys, or change router configuration.
 * See writeups/firmware-key18-provenance/README.md for target-specific build commands.
 */
#define _GNU_SOURCE
#include <ctype.h>
#include <dlfcn.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/stat.h>
#include <unistd.h>

/* The workstation's newer headers use stat(), while stock G6 glibc 2.27
 * exposes the older __xstat entry. AArch64 uses version 0 of that layout.
 */
static int file_stat(const char *path, struct stat *metadata)
{
#ifdef BEACON_G6
    extern int __xstat(int, const char *, struct stat *);
    return __xstat(0, path, metadata);
#else
    return stat(path, metadata);
#endif
}

static int decimal(const unsigned char *bytes, size_t size)
{
    int value = 0;
    for (size_t i = 0; i < size; i++) {
        if (!isdigit(bytes[i])) return -1;
        value = value * 10 + bytes[i] - '0';
    }
    return value;
}

/* KV records contain a ten-byte ASCII header, then name and value bytes.
 * Only name/flag/length metadata is inspected; values are never decoded.
 */
static int inspect_factory(const unsigned char *data, size_t size, int *fields,
                           int *found, int *flag, int *length)
{
    size_t offset = 0;
    *fields = *found = 0;
    *flag = *length = -1;
    while (offset < size && data[offset]) {
        if (size - offset < 10 || memcmp(data + offset, "KV", 2)) return -1;
        int entry_flag = decimal(data + offset + 3, 1);
        int key_length = decimal(data + offset + 4, 2);
        int value_length = decimal(data + offset + 6, 4);
        if (entry_flag < 0 || key_length <= 0 || value_length < 0
                || (size_t)(10 + key_length + value_length) > size - offset)
            return -1;
        if (key_length == 10 && !memcmp(data + offset + 10, "EXT_KEY_FW", 10)) {
            *found = 1;
            *flag = entry_flag;
            *length = value_length;
        }
        (*fields)++;
        offset += (size_t)(10 + key_length + value_length);
    }
    return offset < size && *fields > 0 ? 0 : -1;
}

static int extractor_in_path(void)
{
    const char *path = getenv("PATH");
    if (!path) return 0;
    char *copy = strdup(path);
    if (!copy) return 0;
    char *save = NULL;
    int found = 0;
    for (char *part = strtok_r(copy, ":", &save); part;
            part = strtok_r(NULL, ":", &save)) {
        char candidate[4096];
        int length = snprintf(candidate, sizeof(candidate), "%s/sec_extfs", part);
        struct stat metadata;
        if (length > 0 && (size_t)length < sizeof(candidate)
                && !file_stat(candidate, &metadata) && S_ISREG(metadata.st_mode)
                && !access(candidate, X_OK)) {
            found = 1;
            break;
        }
    }
    free(copy);
    return found;
}

int main(void)
{
    void *security = dlopen("libsec_engine.so", RTLD_NOW | RTLD_GLOBAL);
    if (!security) {
        fprintf(stderr, "Cannot load stock security library: %s\n", dlerror());
        return 1;
    }
    int (*get_key)(const char *, char **) = dlsym(security, "SE_getKeyByName");
    if (!get_key) {
        fputs("Stock named-key API unavailable.\n", stderr);
        return 1;
    }
    char *key18 = NULL, *key17 = NULL;
    int status18 = get_key("key18", &key18);
    int status17 = get_key("key17", &key17);
    size_t length18 = !status18 && key18 ? strlen(key18) : 0;
    size_t length17 = !status17 && key17 ? strlen(key17) : 0;

    struct stat file;
    int file_status = file_stat("/tmp/.ext_fwkey", &file);
    long long file_bytes = !file_status && S_ISREG(file.st_mode)
        ? (long long)file.st_size : -1;

    void *extfs = dlopen("libextfs.so", RTLD_NOW | RTLD_GLOBAL);
    int (*read_record)(const char *, char *, int) =
        extfs ? dlsym(extfs, "extfs_get") : NULL;
    unsigned char data[8193] = {0};
    int read_status = read_record ? read_record("SECURITY", (char *)data, 8192) : -1;
    int fields = 0, found = 0, flag = -1, length = -1;
    int parse_status = read_status ? -1
        : inspect_factory(data, 8192, &fields, &found, &flag, &length);

    printf("{\n"
           "  \"key18_lookup_status\": %d,\n"
           "  \"key18_bytes\": %zu,\n"
           "  \"key17_lookup_status\": %d,\n"
           "  \"key17_bytes\": %zu,\n"
           "  \"fwkey_file_exists\": %s,\n"
           "  \"fwkey_file_bytes\": %lld,\n"
           "  \"sec_extfs_in_path\": %s,\n"
           "  \"factory_security_read_status\": %d,\n"
           "  \"factory_security_parse_status\": %d,\n"
           "  \"factory_security_fields\": %d,\n"
           "  \"factory_EXT_KEY_FW_present\": %s,\n"
           "  \"factory_EXT_KEY_FW_flag\": %d,\n"
           "  \"factory_EXT_KEY_FW_bytes\": %d\n"
           "}\n",
           status18, length18, status17, length17,
           file_status ? "false" : "true", file_bytes,
           extractor_in_path() ? "true" : "false",
           read_status, parse_status, fields,
           parse_status ? "null" : (found ? "true" : "false"), flag, length);
    return 0;
}
