[![view on npm](http://img.shields.io/npm/v/netscape-cookies-exporter.svg)](https://www.npmjs.org/package/netscape-cookies-exporter)
[![npm module downloads per month](http://img.shields.io/npm/dm/netscape-cookies-exporter.svg)](https://www.npmjs.org/package/netscape-cookies-exporter)

# netscape-cookies-exporter

Exports your cookies to the Netscape cookie file format which is compatible with wget, curl, youtube-dl and more.

The Netscape cookie file format stores one cookie per physical line in the file with a bunch of associated meta data, each field separated with TAB. That file is called the cookiejar in curl terminology. The cookie file format is text based and stores one cookie per line. Lines that start with # are treated as comments.

This extension can be super useful in circumstances of using the authenticated cookies from your Chrome browsing session.

## Installation

Installation can be done in any of the following platform - Windows, Linux

### Windows

Install [Node.js](https://nodejs.org/) v12 or higher. Then install netscape-cookies-exporter with npm:

    npm install -g netscape-cookies-exporter

### Linux

In Linux you can either install for all users or just the current user. In either case, you must first install [Node.js](https://nodejs.org/) v12 or higher and any [puppeteer dependencies](https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md#chrome-headless-doesnt-launch). Then follow the appropriate instructions.

#### Option A: Install for All Users

Install netscape-cookies-exporter globally with npm:

    sudo npm install -g netscape-cookies-exporter --unsafe-perm

Puppeteer doesn't install globally with execution permissions for all users so you'll need to modify them:

    sudo chmod -R go+rx $(npm root -g)

#### Option B: Install Only for Current User

First configure npm to install global packages in [your home directory](https://docs.npmjs.com/getting-started/fixing-npm-permissions):

    mkdir ~/.npm-global
    npm config set prefix '~/.npm-global'
    export PATH=~/.npm-global/bin:$PATH
    source ~/.profile
    echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.profile
    source ~/.profile

Then install netscape-cookies-exporter:

    npm install -g netscape-cookies-exporter

Now just run `netscape-cookies-exporter`.

## Usage

To run netscape-cookies-exporter:

```bash
netscape-cookies-exporter -u https://google.com -o cookies.txt
```

What happens next:

1. This will launch Chromium browser on the URL provided
2. You can navigate to any page and perform any actions as you wish, e.g. login
3. DO NOT close the browser just yet!
4. Go back to the terminal once you are ready to extract all the cookies from your current navigation
5. You will be asked "Do you wish to close the browser and extract the cookies now?", enter "Y" when ready
6. Open `cookies.txt` to see all the cookies exported in the Netscape format.
