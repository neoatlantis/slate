NeoAtlantis slate
=================

This is another password manager alike tool. Precisely speaking, it's my
complement to common practices in using a central password managing software.

Password managing using a central database is great but still subjects to a few
issues:

* Phishing: passwords are not domain-bound, and users may be tricked to enter
  their passwords into malcious websites.
* Single point of failure: Should a user leaks the master key, or should the
  key be compromised in any other way, all passwords mananaged are vulnerable.

I try to make some improvements in my strategy in achieving online security
by writing this software.

## Design

The idea is to use a tree of keys, derived from a master secret using HMAC, to
either:

1. protect (encrypt) user passwords,
2. or the keys themselves can be converted into random generated passwords.

User may either import their existing passwords, or generates a new random
password. In both cases, a domain parameter is mixed into symmetric key
derivation, so phishing with another domain is not possible.

The software is a server that accepts remote API calls via Internet. This can
be done using tailscale, Cloudflare tunnels, or XMPP. These calls should
provide above 2 functions for adding new entries, and also a way of retrieving
a stored password.

After importing or generating a password entry, the software relies on the
calling party to store a "handle" for later retrieving the same. This behaves
much like a TPM module and relieves us of keeping any permanent data beyond a
relatively static seed which contains the master key in encrypted form.

Once a password is resumed using the "handle", the software may output it
via a serial port connected to the system. Preferably this should be a
CH340/CH9329 double USB-A cable, where the other end enumerates as a USB-HID
keyboard on target device (function of CH9329 ic) and "types" the password.
