# PRAnCER

PRAnCER (Platform enabling Rapid Annotation for Clinical Entity Recognition) is a web platform that enables the rapid annotation of medical terms within clinical notes. A user can highlight spans of text and quickly map them to concepts in large vocabularies within a single, intuitive platform. Users can use the search and recommendation features to find labels without ever needing to leave the interface. Further, the platform can take in output from existing clinical concept extraction systems as pre-annotations, which users can accept or modify in a single click. These features allow users to focus their time and energy on harder examples instead. 

## Usage

The clinical annotation platform operates by leveraging files derived from the UMLS. 

## Installation

The platform requires **python3.7**, **node.js**, and several other python and javascript packages. Specific installation instructions for each follow!

### Backend requirements

#### 1) First check if python3 is installed.

You can check to see if it is installed:
```
$ python3 --version
```
If it is installed, you should see *Python 3.7.x*

If you need to install it, you can easily do that with a package manager like Homebrew:
```
$ brew install python3
```

#### 2) With python3 installed, install necessary python packages.

You can install packages with the python package installer pip:
```
$ pip3 install flask flask_script flask_migrate flask_bcrypt nltk editdistance requests lxml
```

### Frontend requirements

#### 3) Check to see if npm and node.js are installed:

```
$ npm -v
$ node -v
```

If they are, you can skip to Step 4.
If not, to install node, first install nvm:
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.1/install.sh | bash
```
Source: https://github.com/nvm-sh/nvm

Re-start your terminal and confirm nvm installation with:
```
command -v nvm
```
Which will return ```nvm``` if successful

Then install node version 10.15.1:
```
$ nvm install 10.15.1
```

#### 4) Install the node dependencies:

```
$ cd static
$ npm install --save
```

For remote server applications, permissions errors may be triggered.\
If so, try adding ```--user``` to install commands.

## Run program

### Run the backend

Open one terminal tab to run the backend server:
```sh
$ python3 manage.py runserver
```
If all goes well, you should see `* Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)` followed by a few more lines in the terminal.

### Run the frontend

Open a second terminal tab to run the frontend:
```sh
$ cd static
$ npm start
```

After this, open your browser to http://localhost:3000 and you should see the homepage!

## Contact

If you have any questions, please email Monica Agrawal [magrawal@mit.edu].

Based on [React-Redux-Flask boilerplate.](https://github.com/dternyak/React-Redux-Flask)
