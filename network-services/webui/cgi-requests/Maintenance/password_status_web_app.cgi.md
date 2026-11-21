Page: Maintenance/Change Password

# GET password_status_web_app.cgi
HEADERS
```
GET http://192.168.18.1/password_status_web_app.cgi HTTP/1.1
host: 192.168.18.1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:154.0) Gecko/20100101 Firefox/154.0
Accept: application/json, text/plain, */*
Accept-Language: en-US,en;q=0.9
Referer: https://192.168.18.1/
Content-Type: application/x-www-form-urlencoded
Connection: keep-alive
Cookie: lang=en; sid={SID}; lsid={LSID}
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-origin
Priority: u=0
```

BODY:  
(empty)


Response:
```json
{"login_msg": "",
  "login_cfg": {
    "UserName": "admin"
  },
  "telemex_cfg": {
    "UserName": "superadmin",
    "HelpInfo": ""
  },
  "pwd_check_rule": [
    {
      "regexp_reverse": "[^a-zA-Z0-9!#+,-./:=@_]+",
      "error": "Password can only contain numbers,letters and special character !#+,-./:=@_"
    },
    {
      "regexp_reverse": "^.{0,7}$",
      "error": "Password should be at least 8 characters"
    },
    {
      "regexp_reverse": "^.{25,}$",
      "error": "Password should be at most 24 characters"
    },
    {
      "regexp_reverse": "^[^a-zA-Z0-9]+",
      "error": "First character can not be special one"
    },
    {
      "regexp_reverse": "(^[a-z]+$)|(^[A-Z]+$)|(^[0-9]+$)|(^(!#+,-./:=@_)+$)",
      "error": "At least two character classes are required"
    },
    {
      "regexp_reverse": "([a-zA-Z0-9!#+,-./:=@_])\\1{7}",
      "error": "The same character can not appear consecutively 8 times"
    }
  ],
  "need_display_original_passwd": "TRUE",
  "is_gui_password_hint_msg": "FALSE",
  "alert_warning": "Dear user, it is recommended that in order to improve security, use the uppercase letters and numbers in the new password of your computer.",
  "salt": "<SALT>"
}
```

# POST password_web_app.cgi?set

```
POST http://192.168.18.1/password_web_app.cgi?set HTTP/1.1
host: 192.168.18.1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:154.0) Gecko/20100101 Firefox/154.0
Accept: application/json, text/plain, */*
Accept-Language: en-US,en;q=0.9
Referer: https://192.168.18.1/
Content-Type: application/x-www-form-urlencoded
Content-Length: 383
Origin: https://192.168.18.1
Connection: keep-alive
Cookie: lang=en; sid={SID}; lsid={LSID}
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-origin
Priority: u=0
```

Body (Encrypted):
```
txtPassword: always empty (txtPassword=)
upswd: the original password (or a hash/derived value, depending on security rules)
pswdNew: the new password
pswdConfirm: repeated new password
pwdMsg: the password hint
csrf_token: the CSRF token (appended inside postWithCSRFToken)
(sometimes, read below) upswdHash: an additional hash of the old password for security‑compliance Opid
```

Hash: `sha256_crypt(salt, string)`

When does upswdHash appear?
1. Normal password change (not first login) on Non‑StarHub devices:
     upswdHash is included.   
    The payload sends the plain original password in upswd, and the hashed original password (using sha256_crypt with the server‑provided salt) is placed in upswdHash.
2. Normal password change on StarHub devices (where this.isSecurityComplianceOPID is true, i.e. operator IDs BSGS, SHXX, or SHSG):
     upswdHash is omitted.   
    Instead, the hashed original password is directly placed inside the upswd field, and the server verifies it that way.
3. Forced password change (first login: firstLoginChangePassword = true):
     upswdHash is always omitted, regardless of operator.   
    The payload sends the plain original password in upswd and no extra hash field.


To check if StarHub device or not:
```js
fetch('/main_web_app.cgi')
  .then(res => res.json())
  .then(data => {
    const opId = data.g_operatorId;
    const isStarHub = ['BSGS', 'SHXX', 'SHSG'].includes(opId);
    console.log('Operator ID:', opId);
    console.log('Is StarHub device?', isStarHub);
  })
  .catch(err => console.error('Error fetching router info:', err));
```

Python:
```py
old_pw = ""
new_pw = "v5Nhu99hVw"
pw_msg = ""
salt = ""
old_pw_hash = hashlib.pbkdf2_hmac('sha256', old_pw.encode('utf-8'), salt.encode('utf-8'), 5000)

plaintext = f"txtPassword=&upswd={old_pw}&pswdNew={new_pw}&pswdConfirm={new_pw}&pwdMsg={pw_msg}&csrf_token={CSRF_TOKEN}&upswdHash={old_pw_hash}"
```

Response:
```
{"ret":1,"msg":"set ok"}
OR
{"ret":10,"msg":"Original password error once,please input again!"}
OR
{"ret":20,"msg":"Original password error twice,please input again!"}
OR
{"ret":30,"msg":"Original password error three times,please input again!"}
OR
{"ret":40,"msg":"Error happen more than 3 times and will logout, please retry after 60 seconds!"}
```

