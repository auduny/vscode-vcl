# Varnish Configuration Language -- VCL

This is a plugin for VCL configuraion for varnish. It provides syntax highlighting, linting, and completion based on either VMODs or VCC config files. It does a pretty good job for vlc, and a decent job for vtc (varnish test configuration-files).

## Features

* Syntax for VCL (Varnish Configuration Language) and VTC (Varnish Test Configuration)
* LSP-server support from https://github.com/m4r7inp/varnish-lsp (will be downloaded by extention)
* Goto definition
* Error checking
* Linting
* Completion and linted based on either VMODs or VCC config files

## Configuration
The plugin will look for VCC files in the following places by default
* `./lib`
* `/vcc`
* `/usr/share/varnish/vcc` -- Default location for packages and docker images
* `/opt/homebrew/opt/varnish/share/varnish/vcc -- OSX brew install location
* `$HOME/.varnishls/vcc/` -- Your own VCC files or download a bundle from the github page on https://github.com/auduny/vscode-vcl

This can be changed by either changing configuration or setting the `VARNISHLS_VCC_PATH` enviroment variable in .profile, .zshrc or .bashrc

`export VARNISHLS_VCC_PATHS="vcc:/opt/homebrew/opt/varnish/share/varnish/vcc:$HOME/.vcc-files/varnish-cache:$HOME/.vcc-files/enterprise:$HOME/.vcc-files/custom"`

## Overides
You can create a `.varnishls.toml` file in your workspace directory to override and finetune your setup, all values are optional

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
## Extension Settings

None

## Known Issues

None

