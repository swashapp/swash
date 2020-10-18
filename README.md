# Swash
Swash is a browser extension for collecting and aggregating your browsing activities. This extension collects information about your browsing activities and gives you, ability to sell your data on the [Streamr Marketplace](https://streamr.network/marketplace).

The extension consists of some modules. Each module has some Data Collectors and each Data Collector is responsible for collecting a specific data regarding its module.
A Data Collector collects data using one of these methods:
* Running a JavaScript code in the context of a specific page
* Calling APIs on behalf of you
* Capturing requests sent to/responses received from a specific domain
* Reading your browser information

We provide you with certain controls and choices regarding the data collected on your browser:
* **Enabling/Disabling Swash**. You are able to enable/disable the Swash extension. When the extension is disabled nothing will be collected by the extension.
* **Enabling/Disabling modules**. You are able to enable/disable each module of the Swash
separately. When a module is disabled none of its collectors will collect data.
* **Enabling/Disabling collectors**. You are able to enable/disable each collector of a module. When a collector is disabled it does not collect data.
* **Delay on sending data**. You are able to make custom delay on sending data. It helps you watch data before being sent to the stream and it gives you the ability to cancel any data sending action.
* **Text masking**. This feature allows you to actively mask specific text (characters, digits, single words or combination of them) within the data being captured and shared via the extension. This allows you to cover sensitive information that might be present, for example, within Facebook or Twitter posts or, less probable, search queries. One could for example add any variation of his/her own name, phone number, email, address, close people names etc.
* **Exclude URLs**. This option allows you to specify which URLs you would like to exclude from data collection for all modules. You can use different expressions to exclude an exact match URL, an entire subsection of a URL path or even more advanced rules. Rules applied for this feature will supersede any module’s internal logic, so you can have peace of mind that anything applied correctly here will be followed by all modules.
* **Data Privacy**. We provide you with a privacy mechanism to ensure the privacy of data getting collected by modules. The mechanism works based on the data type and the privacy level. The table below
shows how the privacy mechanism transforms the data based on the data type:


|  Data Type | Lowest Privacy | Medium Privacy                         | High Privacy                                      |
|------------|----------------|----------------------------------------|---------------------------------------------------|
|  URL       |  No changes    | Global masking path name               | Remove path name                                  |
| Time       | No changes     | Remove hours                           | Remove months                                     |
| TimeString | No changes     | Remove hours                           | Remove months                                     |
| Text       | No changes     | Replace defined masking texts with '*' | Remove text if it contains defined masking texts data |
| Id         | No changes     | Global masking                         | Nullify                                           |
| UserInfo   | No changes     | Global masking                         | Nullify                                           |
| UserAttr   | No changes     | Global masking                         | Nullify                                           |




## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

The following applications are required to be installed and configured before you build Swash. 

### Firefox >= 48
A Firefox with version at least 48 is required to be installed on your system.

### Node.js
You can download the Node.js source code or a pre-built installer for your platform from this [link](https://nodejs.org/en/download/)

#### web-ext
web-ext is a node-based application that you install with the nodejs/npm tool. Install web-ext using the following command:

```
npm install --global web-ext
```
To test whether the installation worked run the following command, which displays the web-ext version number:

```
web-ext --version
```

### Swash development

Swash extension consists of two separate projects: 
* *swash-ui*: This project has been developed using React and provides user interface for the extension
* *swash*: This project is the source code for the extension engine

*swash-ui* project should be built and copied to the */dashboard* before you build *swash* project. The instruction for building *swash-ui* can be found [here](https://github.com/swashapp/swash-ui)
 
#### Build instruction for swash

```
git clone https://github.com/swashapp/swash.git
cd swash
cp js/streamConfig.sample.js js/streamConfig.js 
```
Open streamConfig.js file and replace stream ids and API keys with your own. Then copy the built files from *swash-ui build* directory to */dashboard*. Now, you can build the extension.

```
./swash.sh build
```

#### Executing test units

In order to run *swash* test units, run this command:

```
./swash.sh test
```
Then open a new tab. Test units will be started automatically.

#### Running Swash

This command starts Firefox and loads Swash temporarily in the browser:

```
./swash.sh run
```

## License

This project is licensed under the Attribution-NonCommercial-ShareAlike 4.0 International License - see the [LICENSE.md](LICENSE.md) file for details
