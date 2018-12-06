## kendo-ui

For details on how it works visit my blog at http://vedmishra.net/

### Building the code

```bash
git clone the repo
npm i
gulp serve
```

This package produces the following:

* lib/* - intermediate-stage commonjs build artifacts
* dist/* - the bundled script, along with other resources
* deploy/* - all resources which should be uploaded to a CDN.

### Running on localhost
gulp serve

### Deploying on SharePoint site
gulp bundle --ship
gulp package-solution --ship

Very Important: If you don't have Office 365 CDN or Azure CDN setup for deploying package files, then follow my blog article on tips of how to deploy those in a SharePoint library
