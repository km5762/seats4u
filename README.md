# Seats4U
*Important things to keep in mind when using our website:*

<img src="https://i.imgur.com/7IEts4K.png"/>

## General

### Auto Login
Auto login, if you are in venue manager/admin view, and open up another tab, you will be automatically logged into your page based on the cookie stored in your browser. Let's say you are in manager view and want to go to the customer page in another tab. You need to create a new tab, (make sure you use the URL instead of copying and pasting the current website link because that will be URL/manager), it automatically logs you into manager view, then you need to log out, and it will then bring you to the customer page. 

### Auto Logout
Auto logout, if you log out in one tab, it will automatically log you out in all the tabs. The auto-ogin and auto-logout are intentional to make sure you have the correct cookies.

## Venue Manager
### One Price for all Seats
To assign one price for all seats, enter in the input label, and assign it to all seats. To assign different ticket prices to seats using blocks if you have already assigned one price for all seats, you need to delete it (the button will replace the input label after you enter the price). Then the section layout will be clickable and you can click on seats to create blocks.

### Create Block
To create blocks in Venue Manager, press "Get Layout" for each of the three sections, and then click the row(s) you wish to add to the block and add a price in the text box. You will see the seats which are part of a block colored in orange.

### Delete Block
When clicking on a block, the color will change from orange to red, then you will see the option to delete this block.

### List Block
When listing blocks, you need to click the show, press "Get Layout", and then press "List Blocks". It will show you the start and end row for each block along with the price, seat sold, and seat remaining.

### Activate Show
When show activation is successful it will redirect you back to the list of shows displaying a 1 in status. If it is not successful it just won't do anything. (However, if you are very careful, you will find that there is a console warning to say that you cannot create a block unless each seat belongs to a block).

## Customer
### Sort Seats
Instead of sorting the seats, we displayed the seats by different sections, and by different prices (each price corresponds to a color, and you can find a legend for each price).

### One Price for all Seats
When all seats are assigned the same price (the button at the top in Venue Manager), the pricing legend is empty in customer view. This is because the customer can click on any seat and see the price.

## Credentials
### Website URL
http://cs3733b23jasonbucketseats4u3.s3-website.us-east-2.amazonaws.com/

### Venue Manager
Username: *dcuc*
Password: *AluminumDebitBucket20*

### Admin
Username: *admin*
Password: *JeopardyJocularBursar59*

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
