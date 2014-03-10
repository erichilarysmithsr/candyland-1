#!/usr/bin/python

import sys
from struct import *
import kerberos

import hashlib  

def from_ejabberd():
    input_length = sys.stdin.read(2)
    (size,) = unpack('>h', input_length)
    return sys.stdin.read(size).split(':')

def to_ejabberd(bool):
    answer = 0
    if bool:
        answer = 1
    token = pack('>hh', 2, answer)
    sys.stdout.write(token)
    sys.stdout.flush()

def auth(username, server, password):
    username = username.lower()
    try:
        kerberos.checkPassword(username, password, 'login', 'EXAMPLE.COM')
    except kerberos.BasicAuthError, e:
        return False
    return True

def isuser(username, server):
    return True

def setpass(username, server, password):
    return True

while True:
    data = from_ejabberd()
    success = False
    if data[0] == "auth":
        success = auth(data[1], data[2], data[3])
    elif data[0] == "isuser":
        success = isuser(data[1], data[2])
    elif data[0] == "setpass":
        success = setpass(data[1], data[2], data[3])
    to_ejabberd(success)
    
# python-kerberos.x86_64 krb5-workstation-1.10.3-10.el6_4.6.x86_64