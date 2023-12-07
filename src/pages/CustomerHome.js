import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SearchBar from "../component/SearchBar";
import { purchaseSeatsC } from "../controller/Controller";
import BlockCanvas from "../boundary/Boundary";

// Show component representing a rectangular block
const Show = ({ name, date, time, venue, onClick, eventId }) => (
  <div
    style={{
      border: "1px solid black",
      padding: "10px",
      marginBottom: "10px",
      cursor: "pointer",
      width: "200px", // Set a fixed width for each block
      boxSizing: "border-box", // Include padding and border in the width calculation
    }}
    onClick={onClick}
  >
    <p>
      <strong>Show:</strong> {name}
    </p>
    <p>
      <strong>Date:</strong> {date}
    </p>
    <p>
      <strong>Time:</strong> {time}
    </p>
    <p>
      <strong>Venue:</strong> {venue}
    </p>
    <p>
      <strong>Event ID:</strong> {eventId}
    </p>
    {/* <p><strong>Date:</strong> {date.split("T")[0]}</p>
    <p><strong>Time:</strong> {date.split("T")[1].split("Z")[0]}</p> */}
  </div>
);

const Seat = ({ row, col, onClick, selected, blocked }) => (
  <div
    style={{
      border: "1px solid black",
      padding: "4px",
      margin: "2px",
      cursor: "pointer",
      backgroundColor:
        selected && !blocked
          ? "lightblue" // Light blue when selected and not blocked
          : blocked && !selected
          ? "blue" // Blue when blocked and not selected
          : selected && blocked
          ? "blue" // Blue when both selected and blocked
          : "white", // White when neither selected nor blocked
    }}
    onClick={() => onClick(row, col)}
  >
    {`${String.fromCharCode(64 + row).toUpperCase()}-${col}`}
  </div>
);

// Section component containing a grid of seats
const Section = ({
  title,
  rows,
  cols,
  canSelect,
  selectedShowList,
  ticketPrice,
}) => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [blockedSeats, setBlockedSeats] = useState([]);
  const [blocks, setBlocks] = useState([]);

  const handleSeatClick = (row, col, cost) => {
    if (canSelect) {
      // Check if the seat is already selected
      const isSeatSelected = selectedSeats.some(
        (seat) => seat.row === row && seat.col === col
      );
      const isSeatBlocked = blockedSeats.some(
        (seat) => seat.row === row && seat.col === col
      );
      if (!isSeatSelected && !isSeatBlocked) {
        // Add the selected seat to the list
        setSelectedSeats((prevSeats) => [...prevSeats, { row, col, cost }]);
      } else {
        // Remove the selected seat from the list if it's already selected
        setSelectedSeats((prevSeats) =>
          prevSeats.filter((seat) => !(seat.row === row && seat.col === col))
        );
      }
    }
  };

  const purchaseSeats = () => {
    if (selectedSeats.length > 0) {
      // console.log(selectedSeats);
      console.log(selectedShowList)
      purchaseSeatsC(selectedShowList.venue_id,selectedShowList.venue_id, selectedSeats);
      // console.log(title);
      // console.log(selectedSeats);
      setBlockedSeats(prevSeats => [...prevSeats, ...selectedSeats]);
      setBlocks(prevBlocks => [...prevBlocks, selectedSeats]);
      setSelectedSeats([]);
    }
  };

  return (
    <div style={{ padding: "4px" }}>
      <h4>{title}</h4>
      <div
        style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {Array.from({ length: rows }, (_, rowIndex) =>
          Array.from({ length: cols }, (_, colIndex) => (
            <Seat
              key={`${rowIndex}-${colIndex}`}
              row={rowIndex + 1}
              col={colIndex + 1}
              onClick={() =>
                handleSeatClick(rowIndex + 1, colIndex + 1, ticketPrice)
              }
              selected={selectedSeats.some(
                (seat) => seat.row === rowIndex + 1 && seat.col === colIndex + 1
              )}
              blocked={blockedSeats.some(
                (seat) => seat.row === rowIndex + 1 && seat.col === colIndex + 1
              )}
            />
          ))
        )}
      </div>

      {selectedSeats.length > 0 && (
        <div>
          <h3>Selected Seats</h3>
          {selectedSeats.map((seat, index) => (
            <p key={index}>{`Row: ${String.fromCharCode(
              64 + seat.row
            ).toUpperCase()}, Column: ${seat.col}`}</p>
          ))}
          <p>
            Total Cost = $
            {selectedSeats.reduce(
              (costSoFar, currentSeat) => costSoFar + currentSeat.cost,
              0
            )}
            .00
          </p>
          <button onClick={purchaseSeats}>Purchase Seats</button>
        </div>
      )}
      {blocks.length > 0 &&
        blocks.map((block, index) => (
          <div>
            <p>Block</p>
            <span key={index}>
              {block.length > 0 &&
                block.map((seat, j) => (
                  <p key={j}>{`${String.fromCharCode(
                    64 + seat.row
                  ).toUpperCase()}-${seat.col}`}</p>
                ))}
            </span>
          </div>
        ))}
    </div>
  );
};

const CustomerHome = ({ loggedInUser, onLogout }) => {
  const [search, setSearch] = useState(false);
  const [list, setList] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [listOfShows, setListOfShows] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingList, setLoadingList] = useState(false);

  const [selectedShow, setSelectedShow] = useState(null);
  const [selectedShowList, setSelectedShowList] = useState(null);
  const [leftRow, setLeftRow] = useState("");
  const [leftCol, setLeftCol] = useState("");
  const [rightRow, setRightRow] = useState("");
  const [rightCol, setRightCol] = useState("");
  const [centerRow, setCenterRow] = useState("");
  const [centerCol, setCenterCol] = useState("");

  const [layoutDict, setLayoutDict] = useState({
    //1: [10, 20],
  });

  // useEffect(() => {
  //   console.log(layoutDict);
  // }, [layoutDict]);

  // Function to add or update a value in the dictionary
  const updateDict = (key, list) => {
    setLayoutDict((prevDictionary) => {
      const existingSection = prevDictionary[key] || [];
      if (existingSection.length >= 6) {
        return prevDictionary; // Do nothing and return the current state
      }
      const newSection = existingSection.concat(list);

      return {
        ...prevDictionary,
        [key]: newSection,
      };
    });
  };

  // Function to retrieve numbers from the dictionary
  const getLayout = (venueId, num) => {
    // console.log(venueId)
    // console.log(layoutDict)
    let layout = layoutDict[venueId];
    // console.log(layoutDict[venueId])
    // console.log(num)
    // console.log(layout)
    let result = layout[num];
    return result;
  };

  const handleShowClick = (index) => {
    setSelectedShow(searchResults[index]);
    let result = searchResults[index];
    listSeats(result.event_id);
  };

  const handleShowClickList = (index) => {
    setSelectedShowList(listOfShows[index]);
    let result = listOfShows[index];
    listSeats(result.id);
  };

  const handleUnselectShow = () => {
    setSelectedShow(null);
  };

  const handleUnselectShowList = () => {
    setSelectedShowList(null);
  };

  async function handleSearch(query) {
    setLoadingSearch(true);
    setSearchQuery((prevQuery) => {
      // Define an async function to perform the API call
      const fetchData = async () => {
        try {
          console.log(`Search query: ${query}`);
          const res = await fetch(
            "https://4r6n1ud949.execute-api.us-east-2.amazonaws.com/searchevents",
            {
              credentials: "include",
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ searchQuery: query }),
            }
          );
          const data = await res.json();
          console.log(data);
          setSearch(true);
          setList(false);
          setLoadingSearch(false);
          const filteredEvents = data.events.filter(
            (event) => event.event_active
          );
          setSearchResults(filteredEvents);

          data.sections.map(section => {
            // Call addShow for each event
            updateDict(section.venue_id, [section.row_count, section.col_count]);
          });
        } catch (error) {
          console.error("Error occurred while searching show:", error);
        }
      };

      // Call the async function immediately
      fetchData();

      // Return the new state value to update the state
      return query;
    });
  }

  async function listActiveShows() {
    setLoadingList(true);
    const res = await fetch(
      "https://4r6n1ud949.execute-api.us-east-2.amazonaws.com/listevents",
      {
        credentials: "include",
        method: "GET",
      }
    );

    const data = await res.json();
    setSearch(false);
    setList(true);
    const filteredEvents = data.events.filter((event) => event.active);
    setListOfShows(filteredEvents);
    setLoadingList(false);

    data.sections.map(section => {
      // Call addShow for each event
      updateDict(section.venue_id, [section.row_count, section.col_count]);
    });
  }

  const [ticketPrice, setTicketPrice] = useState(null);

  async function listSeats(eventId) {
    try {
      const res = await fetch(
        "https://4r6n1ud949.execute-api.us-east-2.amazonaws.com/listseats",
        {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            eventId: eventId,
          }),
        }
      );

        const data = await res.json();
        console.log(data);

      for (let index = 0; index < data.length; index++) {
        if (data[index].event_id === eventId) {
          // Found the matching id, get the price and break the loop
          let price = parseInt(data[index].price, 10);
          setTicketPrice(price);
          console.log(eventId);
          console.log(price);
          return;
        }
      }
      setTicketPrice(null);
      console.log("no ticket price found");
      return;

      // let price = parseInt(data[0].price, 10);
      // setTicketPrice(price);
      // console.log(data);
      // console.log(data[0]);
      // console.log(data[0].price);
    } catch (error) {
      console.error("Error occurred during listing seats:", error);
    }
  }

  return (
    <div>
      <div className="center-container">
        <img src="/pictures/logo.png" alt="Logo" width="250" height="100" />
      </div>

      {!selectedShow && !selectedShowList && (
        <div className="center-container">
          <h4>
            For customers, you may search shows by (partial) show name and venue
            name here
          </h4>
          {loadingSearch ? (
            <p>loading... </p>
          ) : (
            <div>
              <SearchBar onSearch={handleSearch} />
            </div>
          )}
          <h4>Otherwise, you may list all active shows here</h4>
          {loadingList ? (
            <p>loading... </p>
          ) : (
            <div>
              <button onClick={listActiveShows}>List Active Shows</button>
            </div>
          )}
        </div>
      )}

      <div className="upper-right-text">
        {/* {loggedInUser ? (
            <div>
              <p>Welcome back, {loggedInUser.role} {loggedInUser.username}! Now you may purchase tickets.</p>
              <button onClick={onLogout}>Logout</button>
            </div>
          ) : (
              <p>Please <Link to="/login">log in</Link> here.</p>
          )} */}
        <p>
          Please <Link to="/login">log in</Link> here.
        </p>
      </div>

      <div
        style={{
          position: "absolute",
          left: 100,
          top: 350,
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        {search &&
          !selectedShow &&
          searchResults &&
          searchResults.map((event, index) => (
            <Show
              key={index}
              name={event.event_name}
              date={new Date(event.event_date).toLocaleDateString()}
              time={new Date(event.event_date).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
              venue={event.venue_name}
              eventId={event.event_id}
              onClick={() => handleShowClick(index)}
            />
          ))}
        {selectedShow && (
          <div>
            <Show
              name={selectedShow.event_name}
              date={new Date(selectedShow.event_date).toLocaleDateString()}
              time={new Date(selectedShow.event_date).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
              venue={selectedShow.venue_name}
              eventId={selectedShow.event_id}
            />
            {/* <button onClick={() => listSeats(selectedShow.event_id)}>List Seats</button> */}
            <button onClick={handleUnselectShow}>unselectShow</button>
            <div style={{ position: "absolute", left: 600, top: -200 }}>
              <h3>Venue Layout</h3>
              <div style={{ display: "flex" }}>
                <Section
                  title="Left"
                  rows={getLayout(selectedShow.venue_id, 0)}
                  cols={getLayout(selectedShow.venue_id, 1)}
                  canSelect={true}
                  selectedShowList={selectedShowList}
                  ticketPrice={ticketPrice}
                />
                <Section
                  title="Center"
                  rows={getLayout(selectedShow.venue_id, 2)}
                  cols={getLayout(selectedShow.venue_id, 3)}
                  canSelect={true}
                  selectedShowList={selectedShowList}
                  ticketPrice={ticketPrice}
                />
                <Section
                  title="Right"
                  rows={getLayout(selectedShow.venue_id, 4)}
                  cols={getLayout(selectedShow.venue_id, 5)}
                  canSelect={true}
                  ticketPrice={ticketPrice}
                />
              </div>
            </div>
          </div>
        )}
        {list &&
          !selectedShowList &&
          listOfShows.map((event, index) => (
            <Show
              key={index}
              name={event.name}
              date={new Date(event.date).toLocaleDateString()}
              time={new Date(event.date).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
              venue={event.venue_id}
              eventId={event.id}
              onClick={() => handleShowClickList(index)}
            />
          ))}
        {selectedShowList && (
          <div>
            <Show
              name={selectedShowList.name}
              date={new Date(selectedShowList.date).toLocaleDateString()}
              time={new Date(selectedShowList.date).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
              venue={selectedShowList.venue_id}
              eventId={selectedShowList.id}
            />
            {/* <button onClick={() => listSeats(selectedShowList.id)}>List Seats</button> */}
            <button onClick={handleUnselectShowList}>unselectShow</button>
            <div style={{ position: "absolute", left: 600, top: -200 }}>
              <h3>Venue Layout</h3>
              <div style={{ display: "flex" }}>
                <Section
                  title="Left"
                  rows={getLayout(selectedShowList.venue_id, 0)}
                  cols={getLayout(selectedShowList.venue_id, 1)}
                  canSelect={true}
                  selectedShowList={selectedShowList}
                  ticketPrice={ticketPrice}
                />
                <Section
                  title="Center"
                  rows={getLayout(selectedShowList.venue_id, 2)}
                  cols={getLayout(selectedShowList.venue_id, 3)}
                  canSelect={true}
                  selectedShowList={selectedShowList}
                  ticketPrice={ticketPrice}
                />
                <Section
                  title="Right"
                  rows={getLayout(selectedShowList.venue_id, 4)}
                  cols={getLayout(selectedShowList.venue_id, 5)}
                  canSelect={true}
                  selectedShowList={selectedShowList}
                  ticketPrice={ticketPrice}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* <div className="lower-right-text">
          {loggedInUser && loggedInUser.role === "Manager" ? (
            <div>
              <p>Now you are in Customer view.</p>
              <Link to="/manager">Go back to Manager View</Link>
            </div>
          ) : (
              <p></p>
          )}

          {loggedInUser && loggedInUser.role === "Administrator" ? (
              <div>
                <p>Now you are in Customer view.</p>
                <Link to="/admin">Go back to Admin View</Link>
              </div>
          ) : (
              <p></p>
          )}
        </div> */}
    </div>
  );
};

export default CustomerHome;
