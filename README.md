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
