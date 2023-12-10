+++
title = "Git Signing and Authentication with SSH"
date = 2023-10-04

[taxonomies]
tags = ["ssh", "git"]
categories = ["programming"]
+++

This is a quick guide to set up git with SSH ed25519 keys
not only for authenticating with GitHub or GitLab but also
for signing commits without the need to install GPG/PGP
which has some serious [criticisms / flaws](https://www.latacora.com/blog/2019/07/16/the-pgp-problem/) that has led me to move
into a world without it. The new world isn't _as_ straightforward
as the old so I thought I'd just throw together a quick guide
to help you out.

<!-- more -->

### SSH

When connecting to remote instances, GitHub, GitLab, etc... you will likely
need an SSH key. The great thing about new versions of git and the providers is
that [ed25519](https://en.wikipedia.org/wiki/EdDSA) keys support authentication and signing. So you can set up your
`git` and SSH to avoid the entire need for GPG/PGP (if you need to share data
securely I recommend [Age](https://github.com/FiloSottile/age) or [Magic
Wormhole](https://github.com/magic-wormhole/magic-wormhole) for secure
transfers).

To get started simply:

```bash
EMAIL = "Your Email Address"

ssh-keygen -t ed25519 -C "$EMAIL" # Generate a key-pair

# Will make two files id_ed25519.pub and id_ed25519
git config --global user.name "First Last"
git config --global user.email "$EMAIL"
git config --global --unset gpg.format
git config --global gpg.format ssh  # Set the GPG format to use ssh instead of gpg
git config --global user.signingkey ~/.ssh/id_ed25519.pub # Set the signing key
git config --global commit.gpgsign true # Configure git to sign commits

touch ~/.ssh/allowed_signers # Create a lookup of allowed signers
echo "$EMAIL $(cat ~/.ssh/id_ed25519.pub)" >> ~/.ssh/allowed_signers # Add this one
git config --global gpg.ssh.allowedSignersFile "$HOME/.ssh/allowed_signers" # Point git at your signers

# Add the key to your keychain
# Mac
ssh-add --apple-use-keychain

# Linux
ssh-add -k

# You can verify it's there with
ssh-add -L
```

Then just navigate to [GitHub](https://github.com/settings/keys) and paste the
contents of your public ssh key (The contents of ~/.ssh/id_ed25519.pub) and
upload it twice, once as an authentication key and once as a signing key.

On GitLab you only need to upload it once and select it's purpose as being for both
authentication and signing.
