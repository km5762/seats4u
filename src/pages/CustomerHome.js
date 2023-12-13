import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "../component/SearchBar";
import { purchaseSeatsC } from "../controller/Controller";
// import BlockCanvas from "../boundary/Boundary";

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
  </div>
);

const Seat = ({ row, col, onClick, selected, blocked, available }) => (
  <div
    style={{
      border: "1px solid black",
      padding: "4px",
      margin: "2px",
      cursor: "pointer",
      backgroundColor:
        selected ? "lightblue" : available && !blocked ? "white" : "gray",
    }}
    onClick={() => onClick(row, col)}
  >
    {`${col}`}
  </div>
);

// Section component containing a grid of seats
const Section = ({
  title,
  rows,
  cols,
  canSelect,
  ticketPriceList,
  availableList,
  startId,
}) => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [blockedSeats, setBlockedSeats] = useState([]);
  const [blocks, setBlocks] = useState([]);

  const handleSeatClick = (row, col, cost) => {
    cost = parseInt(cost, 10);
    let id = startId + (row - 1) * cols + col - 1;
    if (canSelect && availableList[(row - 1) * cols + col - 1] === 1) {
      const isSeatSelected = selectedSeats.some(
        (seat) => seat.row === row && seat.col === col
      );
      const isSeatBlocked = blockedSeats.some(
        (seat) => seat.row === row && seat.col === col
      );
      if (!isSeatSelected && !isSeatBlocked) {
        setSelectedSeats((prevSeats) => [...prevSeats, { row, col, cost, id }]);
      } else {
        setSelectedSeats((prevSeats) =>
          prevSeats.filter((seat) => !(seat.row === row && seat.col === col))
        );
      }
    }
  };

  const purchaseSeats = () => {
    if (selectedSeats.length > 0) {
      console.log(selectedSeats);
      const idList = [];
      for (let index = 0; index < selectedSeats.length; index++) {
        idList.push(selectedSeats[index].id);
      }
      purchaseSeatsC(idList);
      setBlockedSeats((prevSeats) => [...prevSeats, ...selectedSeats]);
      setSelectedSeats([]);
    }
  };

  return (
    <div style={{ padding: "4px" }}>
      <h4>{title}</h4>
      <div style={{ display: "grid", gridTemplateColumns: `auto repeat(${cols}, 1fr)` }}>
        {Array.from({ length: rows }, (_, rowIndex) => (
          <>
            <div style={{ gridRow: rowIndex + 1, alignSelf: "center" }}>{String.fromCharCode(65 + rowIndex)}</div>
            {Array.from({ length: cols }, (_, colIndex) => (
              <Seat
                key={`${rowIndex}-${colIndex}`}
                row={rowIndex + 1}
                col={colIndex + 1}
                onClick={() =>
                  handleSeatClick(rowIndex + 1, colIndex + 1, ticketPriceList[rowIndex * cols + colIndex])
                }
                selected={selectedSeats.some(
                  (seat) => seat.row === rowIndex + 1 && seat.col === colIndex + 1
                )}
                blocked={blockedSeats.some(
                  (seat) => seat.row === rowIndex + 1 && seat.col === colIndex + 1
                )}
                available={availableList[rowIndex * cols + colIndex] === 1}
                id={startId}
              />
            ))}
          </>
        ))}
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

const CustomerHome = ({ loggedInUser, setLoggedInUser, onLogout }) => {
  const [search, setSearch] = useState(false);
  const [list, setList] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [listOfShows, setListOfShows] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingList, setLoadingList] = useState(false);

  const [selectedShow, setSelectedShow] = useState(null);
  const [selectedShowList, setSelectedShowList] = useState(null);

  const [layoutDict, setLayoutDict] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const handleLogin = async () => {
      // Simulate login logic (you would typically perform an API call here)
      try {
        const res = await fetch(
          "https://4r6n1ud949.execute-api.us-east-2.amazonaws.com/signinuserbytoken",
          {
            credentials: "include",
            method: "GET",
          }
        );

        const data = await res.json();

        if (data && data.user) {
          if (data.user.role_id === 2) {
            if (data.venue && data.venue.length > 0) {
              if (data.venue.length === 1) {
                const singleVenue = data.venue[0];
                console.log("Only one venue found:", singleVenue);
                // Venue manager with a single venue
                navigate("/manager", { state: { userData: data } });
                localStorage.setItem("login", JSON.stringify(true));
                console.log(res);
                console.log(data);
              }
            } else {
              console.log("No venues found in the response");
              navigate("/manager", { state: { userData: data } });
              localStorage.setItem("login", JSON.stringify(true));
              console.log(res);
              console.log(data);
            }

            // Set the logged-in user
            setLoggedInUser(data.user);
          } else if (data.user.role_id === 1) {
            // Redirect to '/admin'
            navigate("/admin", { state: { userData: data } });
            setLoggedInUser(data.user);
            localStorage.setItem("login", JSON.stringify(true));
          } else {
            console.log("User doesn't have the required role for this action");
          }
        } else {
          console.log("Invalid user data or role information");
        }
      } catch (error) {
        console.error("Error occurred during login:", error);
      }
      // For simplicity, just set the logged-in user to the entered username
      // setLoggedInUser({ username, role });
    };

    const checkLogin = (event) => {
      console.log("Checking login");
      if (event && event.key === "login") {
        const login = localStorage.getItem("login");
        if (JSON.parse(login) === true) {
          handleLogin();
        } else {
          onLogout();
          navigate("/");
        }
      }
    };

    const login = localStorage.getItem("login");
    if (JSON.parse(login)) {
      handleLogin();
    } else {
      onLogout();
    }

    window.addEventListener("storage", checkLogin);

    return () => {
      window.removeEventListener("storage", checkLogin);
    };
  }, [navigate, setLoggedInUser, onLogout]);

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
    let layout = layoutDict[venueId];
    // console.log(layoutDict[venueId])
    let result = layout[num];
    return result;
  };

  const handleShowClick = async (index) => {
    setSelectedShow(searchResults[index]);
    let result = searchResults[index];
    console.log(result);
    await listSeats(result.event_id, result.venue_id);
  };

  const handleShowClickList = async (index) => {
    setSelectedShowList(listOfShows[index]);
    let result = listOfShows[index];
    console.log(result);
    await listSeats(result.id, result.venue_id);
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

          data.sections.forEach((section) => {
            // Call addShow for each event
            updateDict(section.venue_id, [
              section.row_count,
              section.col_count,
            ]);
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

    data.sections.forEach((section) => {
      // Call addShow for each event
      updateDict(section.venue_id, [section.row_count, section.col_count]);
    });
  }

  const [leftTicketPriceList, setLeftTicketPriceList] = useState([]);
  const [midTicketPriceList, setMidTicketPriceList] = useState([]);
  const [rightTicketPriceList, setRightTicketPriceList] = useState([]);
  const [availableList, setAvailableList] = useState([]);
  const [startId, setStartId] = useState(null);
  const [soldOut, setSoldout] = useState(false);

  async function listSeats(eventId, venueId) {
    setAvailableList([]);

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

      setStartId(data.seats[0].id);

      let listOfAvailability = [];

      for (let index = 0; index < data.seats.length; index++) {
        setAvailableList((prevList) => [
          ...prevList,
          data.seats[index].available,
        ]);
        listOfAvailability.push(data.seats[index].available);
        console.log(data.seats[index].available);
      }

      console.log(listOfAvailability);
      const isSoldOut = listOfAvailability.every(item => item === 0);
      console.log(isSoldOut);
      setSoldout(isSoldOut);

      if (data.blocks[0].section_id === null) {
        let leftSeatNumber = getLayout(venueId, 0) * getLayout(venueId, 1);
        let midSeatNumber = getLayout(venueId, 2) * getLayout(venueId, 3);
        let rightSeatNumber = getLayout(venueId, 4) * getLayout(venueId, 5);

        setLeftTicketPriceList(Array.from({ length: leftSeatNumber }, () => data.blocks[0].price));
        setMidTicketPriceList(Array.from({ length: midSeatNumber }, () => data.blocks[0].price));
        setRightTicketPriceList(Array.from({ length: rightSeatNumber }, () => data.blocks[0].price));

        return;
      }

      // Group blocks by section_id
      const groupedBlocks = data.blocks.reduce((acc, block) => {
        const sectionId = block.section_id;
        if (!acc[sectionId]) {acc[sectionId] = [];}
        acc[sectionId].push(block);
        return acc;
      }, {});

      // Sort each section list by start_row
      const sortedBlocks = Object.keys(groupedBlocks).reduce((acc, sectionId) => {
        const sortedList = groupedBlocks[sectionId].sort((a, b) => a.start_row - b.start_row);
        acc.push(sortedList);
        return acc;
      }, []);

      const leftCostList =[];
      const midCostList =[];
      const rightCostList =[];

      const leftCol = getLayout(venueId, 1);
      const midCol = getLayout(venueId, 3);
      const rightCol = getLayout(venueId, 5);

      const leftBlocks = sortedBlocks[0];
      const midBlocks = sortedBlocks[1];
      const rightBlocks = sortedBlocks[2];

      console.log(leftBlocks)
      console.log(midBlocks)
      console.log(rightBlocks)

      leftBlocks.forEach((block) => {
        const numColumns = leftCol;
        for (let row =  block.start_row; row <= block.end_row; row++) {
          for (let col = 1; col <= numColumns; col++) {
            leftCostList.push(block.price);
          }
        }
        console.log(leftCostList);
      });

      midBlocks.forEach((block) => {
        const numColumns = midCol;
        for (let row =  block.start_row; row <= block.end_row; row++) {
          for (let col = 1; col <= numColumns; col++) {
            midCostList.push(block.price);
          }
        }
        console.log(midCostList);
      });

      rightBlocks.forEach((block) => {
        const numColumns = rightCol;
        for (let row =  block.start_row; row <= block.end_row; row++) {
          for (let col = 1; col <= numColumns; col++) {
            rightCostList.push(block.price);
          }
        }
        console.log(rightCostList);
      });

      setLeftTicketPriceList(leftCostList);
      setMidTicketPriceList(midCostList);
      setRightTicketPriceList(rightCostList);

      return;

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
              onClick={async () => { await handleShowClick(index) }}
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
                  ticketPriceList={leftTicketPriceList}
                  availableList={availableList.slice(
                    0,
                    getLayout(selectedShow.venue_id, 0) *
                    getLayout(selectedShow.venue_id, 1)
                  )}
                  startId={startId}
                />
                <Section
                  title="Center"
                  rows={getLayout(selectedShow.venue_id, 2)}
                  cols={getLayout(selectedShow.venue_id, 3)}
                  canSelect={true}
                  ticketPriceList={midTicketPriceList}
                  availableList={availableList.slice(
                    getLayout(selectedShow.venue_id, 0) *
                    getLayout(selectedShow.venue_id, 1),
                    getLayout(selectedShow.venue_id, 0) *
                    getLayout(selectedShow.venue_id, 1) +
                    getLayout(selectedShow.venue_id, 2) *
                    getLayout(selectedShow.venue_id, 3)
                  )}
                  startId={
                    startId +
                    getLayout(selectedShow.venue_id, 0) *
                    getLayout(selectedShow.venue_id, 1)
                  }
                />
                <Section
                  title="Right"
                  rows={getLayout(selectedShow.venue_id, 4)}
                  cols={getLayout(selectedShow.venue_id, 5)}
                  canSelect={true}
                  ticketPriceList={rightTicketPriceList}
                  availableList={availableList.slice(
                    getLayout(selectedShow.venue_id, 0) *
                    getLayout(selectedShow.venue_id, 1) +
                    getLayout(selectedShow.venue_id, 2) *
                    getLayout(selectedShow.venue_id, 3),
                    getLayout(selectedShow.venue_id, 0) *
                    getLayout(selectedShow.venue_id, 1) +
                    getLayout(selectedShow.venue_id, 2) *
                    getLayout(selectedShow.venue_id, 3) +
                    getLayout(selectedShow.venue_id, 4) *
                    getLayout(selectedShow.venue_id, 5)
                  )}
                  startId={
                    startId +
                    getLayout(selectedShow.venue_id, 0) *
                    getLayout(selectedShow.venue_id, 1) +
                    getLayout(selectedShow.venue_id, 2) *
                    getLayout(selectedShow.venue_id, 3)
                  }
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
              onClick={async () => { await handleShowClickList(index) }}
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
                  ticketPriceList={leftTicketPriceList}
                  availableList={availableList.slice(
                    0,
                    getLayout(selectedShowList.venue_id, 0) *
                    getLayout(selectedShowList.venue_id, 1)
                  )}
                  startId={startId}
                />
                <Section
                  title="Center"
                  rows={getLayout(selectedShowList.venue_id, 2)}
                  cols={getLayout(selectedShowList.venue_id, 3)}
                  canSelect={true}
                  ticketPriceList={midTicketPriceList}
                  availableList={availableList.slice(
                    getLayout(selectedShowList.venue_id, 0) *
                    getLayout(selectedShowList.venue_id, 1),
                    getLayout(selectedShowList.venue_id, 0) *
                    getLayout(selectedShowList.venue_id, 1) +
                    getLayout(selectedShowList.venue_id, 2) *
                    getLayout(selectedShowList.venue_id, 3)
                  )}
                  startId={
                    startId +
                    getLayout(selectedShowList.venue_id, 0) *
                    getLayout(selectedShowList.venue_id, 1)
                  }
                />
                <Section
                  title="Right"
                  rows={getLayout(selectedShowList.venue_id, 4)}
                  cols={getLayout(selectedShowList.venue_id, 5)}
                  canSelect={true}
                  ticketPriceList={rightTicketPriceList}
                  availableList={availableList.slice(
                    getLayout(selectedShowList.venue_id, 0) *
                    getLayout(selectedShowList.venue_id, 1) +
                    getLayout(selectedShowList.venue_id, 2) *
                    getLayout(selectedShowList.venue_id, 3),
                    getLayout(selectedShowList.venue_id, 0) *
                    getLayout(selectedShowList.venue_id, 1) +
                    getLayout(selectedShowList.venue_id, 2) *
                    getLayout(selectedShowList.venue_id, 3) +
                    getLayout(selectedShowList.venue_id, 4) *
                    getLayout(selectedShowList.venue_id, 5)
                  )}
                  startId={
                    startId +
                    getLayout(selectedShowList.venue_id, 0) *
                    getLayout(selectedShowList.venue_id, 1) +
                    getLayout(selectedShowList.venue_id, 2) *
                    getLayout(selectedShowList.venue_id, 3)
                  }
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerHome;