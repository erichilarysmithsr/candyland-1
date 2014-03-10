# Kerberos Authentication for Ejabberd
External authentication script for kerberos authenticaion and ejabberd.

## Requires
* Kerberos to be properly configured.
* A vailid /etc/krb5.conf file.
* The python kerberos module..

## Install

1. Create a copy of the **kerberos-auth.py** script and replace **EXAMPLE.COM** with your kerberos domain name. See *krb5.conf* example.
2. Copy the script into an ejabber directory. e.g. /opt/ejabberd-13.12/
3. Use chmod to set the file as executable. You might want to test with python.
4. Run **kinit** and verify that authentication is working. e.g. `kinit username@EXAMPLE.COM`
5. Configure ejabberd. See example for external authentication.

## Example: Ejabberd external auth.

    %%
    %% Authentication using external script
    %% Make sure the script is executable by ejabberd.
    %%
    {auth_method, external}.
    {extauth_program, "python /opt/ejabberd-13.12/kerberos-auth.py"}.

## Example: krbf.conf
    
    [logging]
     default = FILE:/var/log/krb5libs.log
     kdc = FILE:/var/log/krb5kdc.log
     admin_server = FILE:/var/log/kadmind.log
    
    [libdefaults]
     default_realm = EXAMPLE.COM
     dns_lookup_realm = false
     dns_lookup_kdc = false
     ticket_lifetime = 24h
     renew_lifetime = 7d
     forwardable = true
    
    [realms]
    
     EXAMPLE.COM = {
      kdc = kerberos.example.com
      admin_server = kerberos.example.com
     }
    
    [domain_realm]
     .example.com = EXAMPLE.COM
     example.com = EXAMPLE.COM
     
     










