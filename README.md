# Varnish Configuration Language - VCL

This is a plugin for VCL configuraion.

## Features

* Syntax for VCL (Varnish Configuration Language) and VTC (Varnish Test Configuration)
* LSP-server support from https://github.com/m4r7inp/varnish-lsp (bundled)
* Goto definition
* Error checking
* Completion based on either VMODs or VCC config files

## Requirements
Create a `.varnishls.toml` file in your workspace directory

```toml
# .varnishls.toml in your workspace dir
main_vcl = "vg/varnish.vcl" # path to the main (root) vcl file varnish uses in the workspace 
vmod_paths = ["/usr/lib/varnish-plus/vmods/"] # paths to directories containing your vmods (.so binaries)
vcc_paths = ["/usr/src/varnish-cache/lib/"] # paths to directories containing vcc files (vmod definition files)
```

vcc_paths will be used in place of vmods_paths if it exists.

VCC are varnish-spesific "header"-files that contains syntax and docs for vmods.
Create a directory where you dump all the VCC files that match the vmods you are using and point the vcc_paths there.

Example here: https://github.com/varnish/varnish-modules/blob/master/src/vmod_header.vcc


## Extension Settings

None

## Known Issues

None

## Release Notes

#### 1.0.0
* Added support for Martins wonderfull varnish language server in rust https://github.com/M4R7iNP/varnishls

### 0.0.2 
* Added support for VTC

### 0.0.1
* Initial release
