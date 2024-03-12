# Varnish Configuration Language -- VCL

This is a plugin for VCL configuraion for varnish. It provides syntax highlighting, linting, and completion based on either VMODs or VCC config files. It does a pretty good job for vlc, and a decent job for vtc (varnish test configuration-files).

## Features

* Syntax for VCL (Varnish Configuration Language) and VTC (Varnish Test Configuration)
* LSP-server support from https://github.com/m4r7inp/varnish-lsp (bundled)
* Goto definition
* Error checking
* Linting
* Completion based on either VMODs or VCC config files

## Requirements
Create a `.varnishls.toml` file in your workspace directory

```toml
# .varnishls.toml in your workspace dir
main_vcl = "varnish.vcl" # path to the main vcl file varnish uses
vcl_paths= ["./"] # Where to look for vcl that are included
vcc_paths= ["../vcc-files/lib", "/usr/src/varnish-cache/lib/"] # paths to directories containing your vcc files
vmod_paths = ["/usr/lib/varnish-plus/vmods/"] # paths to directories containing your vmods (.so binaries)
[lint]
prefer_else_if = "hint"
prefer_lowercase_headers = "hint"
prefer_custom_headers_without_prefix = false
```

VCC are varnish-spesific "header"-files that contains syntax and docs for vmods.
Create a directory where you dump all the VCC files that match the vmods you are using and point the vcc_paths there.

Example here: https://github.com/varnish/varnish-modules/blob/master/src/vmod_header.vcc


## Extension Settings

None

## Known Issues

None

