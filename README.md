# Appointment App

This is an appointment app built using Angular(v 15.0.4.), Typescript, Tailwind, SCSS, Google Firebase and Firestore. The app allows users to schedule appointments. The app also includes authentication-based features that only logged-in users have access to.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Technologies](#technologies)
- [Contributing](#contributing)
- [License](#license)

## Installation

To install the app, you'll need to follow these steps:

1. Clone the repository:
```properties
git clone https://github.com/valhio/appointment-app.git
```  

2. Install the dependencies:
```properties
npm install
```  

3. Set up Firebase and Firestore:

- Create a new Firebase project
- Enable email/password authentication in Firebase
- Create a new Firestore database and configure the rules

4. Set up environment variables:

- Copy the `.env.example` file to `.env`
- Update the values in `.env` with your Firebase project configuration

## Usage

To run the app, use the following command:
```properties
npm start
```  
This will start the app and open it in your default browser.

## Features

The appointment app includes the following features:

- Authentication with email/password
- View appointments
- Schedule appointments
- Admin dashboard (only accessible by authenticated users with admin privileges)

## Technologies

The appointment app was built using the following technologies:

- Angular
- Typescript
- SCSS
- Tailwind
- Google Firebase
- Firestore

## Contributing

If you'd like to contribute to the appointment app, please follow these steps:

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Test your changes
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

