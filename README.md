# JAMT - Just Another Monitoring Tool

## Project Description
JAMT (read as JAM) is a log monitoring tool that combines the simplicity of a CLI tool with the convenience of a WebUI. This lightweight solution allows you to effortlessly monitor logs, providing valuable insights into your application's behavior. With minimal setup, you can start monitoring logs and gaining valuable insights without any hassle.

## Features
- Plug and Play: 
Get started quickly with minimal configuration. JAMT is designed to be effortlessly integrated into your project, making log monitoring a breeze.

- User-Friendly: 
We believe in simplicity. The user interface is intuitive, and the setup process is straightforward, making it accessible for developers of all levels.

- Lightweight: 
JAMT is built with efficiency in mind. It won't weigh down your application, ensuring optimal performance even in resource-constrained environments.

## Getting Started
### Installation

```node
npm i -g jamt
```

### Usage

JAMT setup is simple cli command. 
```ShellSession
foo@bar:~$ jamt
? Please choose which port you want to use for dashboard view 3000
Monitoring server setup at 3000
For api docs go to: http://localhost:3000/docs
For Monitoring dashboard go to: http://localhost:3000/
```

Setting up application server. We have an post endpoint open on monitoring server that listens to incoming logs and shows them to user.  

```javascript
const winston = require('winston');

//if it supports http request
// this example is based on winston.
const logger = winston.createLogger({
  transports: [
    new winston.transports.Http({
        level: "silly",
        port: process.env.MONITOR_PORT, // in this case it will be 3000
        path:"/api/listener",
        handleExceptions: true,
        json: true,
        colorize: false
      }),
  ],
  exitOnError: false,
});

// All of this logs can be seen on monitoring UI 
// monitoring UI http://localhost:3000/
logger.info('This is an informational message.');
logger.warn('Warning: Something might need attention.');
logger.error('Oops! An error occurred.');

```

If your logger doesn't support http transport, you can simply post your data over our server. we are planning to provide more simpler solution, pretty soon🤞
```javascript
const logger = {
    post = (level, msg)=>{
        let url = "localhost:3000/api/listener"; //considering JAMT runing locally on port 3000.  
        let body = {
            timestamp: new Date(), 
            level: level,
            message: msg 
        }; 
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body)
        })
    },
    info = (msg)=>{
        console.log(msg);
        post("info", msg);
    },
    warn = (msg) => {
        console.warn(msg);
        post("warn", msg);
    },
    error = (msg) => {
        console.err(msg);
        post("error", msg);
    }
}

// All of this logs can be seen on monitoring UI 
// monitoring UI http://localhost:3000/
logger.info('This is an informational message.');
logger.warn('Warning: Something might need attention.');
logger.error('Oops! An error occurred.');
```

## Configuration
JAMT currently have only one configurable setting, port, for monitoring and dashboard UI. 

## Examples
Check out the examples directory for sample configurations and use cases to help you get started quickly.

## Contributing
We welcome contributions! If you find a bug, have a feature request, or want to contribute code, please follow our contribution guidelines.

## License
JAMT is licensed under the MIT License. See the LICENSE file for details.

## Contact
Have questions or need support? Feel free to contact us.

Hitansh Doshi: [linkedIn](https://www.linkedin.com/in/hitansh-doshi-b81530197/)

Harshit Daga: [linkedIn](https://www.linkedin.com/in/harshit-daga-0476541ba/)


## Enjoy Simple Log Monitoring with JAMT!
Thank you for choosing JAMT for your log monitoring needs. We hope it simplifies your development process and enhances your debugging and monitoring capabilities.

