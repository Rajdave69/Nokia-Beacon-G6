#define _POSIX_C_SOURCE 200809L
#include <errno.h>
#include <fcntl.h>
#include <signal.h>
#include <stdio.h>
#include <string.h>
#include <time.h>
#include <unistd.h>
static volatile sig_atomic_t stopping;
static void stop_handler(int sig) { (void)sig; stopping = 1; }
static int marker(const char *path, const char *text) {
    int fd = open(path, O_WRONLY | O_CREAT | O_TRUNC, 0644);
    if (fd < 0) return -1;
    size_t size = strlen(text), done = 0;
    while (done < size) {
        ssize_t n = write(fd, text + done, size - done);
        if (n < 0 && errno == EINTR) continue;
        if (n <= 0) { close(fd); return -1; }
        done += (size_t)n;
    }
    return close(fd);
}
int main(int argc, char **argv) {
    if (argc == 2 && strcmp(argv[1], "--self-test") == 0) {
        puts("beacon-lcm-smoke self-test ok");
        return 0;
    }
    struct sigaction action;
    memset(&action, 0, sizeof(action));
    action.sa_handler = stop_handler;
    sigemptyset(&action.sa_mask);
    if (sigaction(SIGTERM, &action, NULL) || sigaction(SIGINT, &action, NULL) ||
        sigaction(SIGPWR, &action, NULL)) return 10;
    if (marker("/tmp/beacon-lcm-smoke.started", "beacon-lcm-smoke 0.0.1 started\n")) {
        perror("startup marker");
        return 11;
    }
    puts("beacon-lcm-smoke 0.0.1 running");
    fflush(stdout);
    while (!stopping) {
        struct timespec delay = { 1, 0 };
        nanosleep(&delay, NULL);
    }
    if (marker("/tmp/beacon-lcm-smoke.stopped", "beacon-lcm-smoke 0.0.1 stopped\n")) return 12;
    return 0;
}
