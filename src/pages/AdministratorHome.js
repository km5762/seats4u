import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
// import SearchBar from "../component/SearchBar";
//import SpecificSearchBar from "../component/SpecificSearchBar";
import { Administrator } from "../model/Model";
import {
  deleteShowAdminC,
  // createVenueC,
  // deleteVenueC,
  createShowAdminC,
  // deleteShowC,
  activateShowAdminC,
  randomFloatC
} from "../controller/Controller";

// Seat component representing a clickable seat
const Seat = ({ row, col, cost, onClick, selected, blocked }) => (
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
            : `rgb(${randomFloatC(0, 241, cost) + 15}, ${randomFloatC(0, 221, cost * 20) + 35}, ${randomFloatC(0, 201, cost * 40) + 55})`, // White when neither selected nor blocked
    }}
    onClick={() => onClick(row, col)}
  >
    {`${col}`}
  </div>
);

// Section component containing a grid of seats
const Section = ({ title, rows, cols, canSelect, ticketPriceList}) => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [blockedSeats, setBlockedSeats] = useState([]);
  const [blocks, setBlocks] = useState([]);

  const handleSeatClick = (row, col, maxCols) => {
    if (canSelect) {
      // Check if the seat is already selected
      const isSeatSelected = selectedSeats.some(
        (seat) => seat.row === row && seat.col === col
      );

      if (!isSeatSelected) {
        // Add the selected seat to the list
        // setSelectedSeats(prevSeats => [...prevSeats, { row, col }]);
        // console.log(row);
        // console.log(col);
        for (let col = 1; col < maxCols + 1; col++) {
          setSelectedSeats((prevSeats) => [...prevSeats, { row, col }]);
          console.log(row);
          console.log(col);
          console.log(selectedSeats);
        }
      } else {
        // Remove the selected seat from the list if it's already selected
        for (let col = 1; col < maxCols + 1; col++) {
          setSelectedSeats((prevSeats) =>
            prevSeats.filter((seat) => !(seat.row === row && seat.col === col))
          );
        }
      }
    }
  };

  // useEffect(() => {
  //   console.log(selectedSeats);
  // }, [selectedSeats]);

  const addBlock = () => {
    if (selectedSeats.length > 0) {
      console.log(selectedSeats);
      setBlockedSeats((prevSeats) => [...prevSeats, ...selectedSeats]);
      setBlocks((prevBlocks) => [...prevBlocks, selectedSeats]);
      setSelectedSeats([]);
    }
  };

  return (
    <div style={{ padding: "4px" }}>
      <h4>{title}</h4>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `auto repeat(${cols}, 1fr)`,
        }}
      >
        {Array.from({ length: rows }, (_, rowIndex) => (
          <>
            <div style={{ gridRow: rowIndex + 1, alignSelf: "center" }}>
              {String.fromCharCode(65 + rowIndex)}
            </div>
            {Array.from({ length: cols }, (_, colIndex) => (
              <Seat
                key={`${rowIndex}-${colIndex}`}
                row={rowIndex + 1}
                col={colIndex + 1}
                cost={ticketPriceList[rowIndex * cols + colIndex]}
                onClick={() =>
                  handleSeatClick(rowIndex + 1, colIndex + 1, cols)
                }
                selected={selectedSeats.some(
                  (seat) =>
                    seat.row === rowIndex + 1 && seat.col === colIndex + 1
                )}
                blocked={blockedSeats.some(
                  (seat) =>
                    seat.row === rowIndex + 1 && seat.col === colIndex + 1
                )}
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
          <button onClick={addBlock}>Add block</button>
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

// Show component representing a rectangular block
const Show = ({ name, date, time, venue, onClick, id, active }) => (
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
      <strong>Status:</strong> {active}
    </p>
    <p>
      <strong>Id:</strong> {id}
    </p>
    {/* <p><strong>Date:</strong> {date.split("T")[0]}</p>
    <p><strong>Time:</strong> {date.split("T")[1].split("Z")[0]}</p> */}
  </div>
);

// Show component representing a rectangular block
const Venue = ({ name, onClick }) => (
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
      <strong>Venue:</strong> {name}
    </p>
  </div>
);

const AdminHome = ({ loggedInUser, setLoggedInUser, onLogout }) => {
  const [administrator, setAdministrator] = React.useState(new Administrator());
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const receivedData = location.state.userData;

  useEffect(() => {
    console.log(location);
    setVenues(location.state.userData.venues);
  }, [location]);

  const [venues, setVenues] = useState(location.state.userData.venues);
  const [selectedVenue, setSelectedVenue] = useState(null);

  const [listOfShows, setListOfShows] = useState([]);

  const [hideList, setHideList] = useState(true);
  const [ticketPrice, setTicketPrice] = useState(null);
  // const [leftRow, setLeftRow] = useState("");
  // const [leftCol, setLeftCol] = useState("");
  // const [rightRow, setRightRow] = useState("");
  // const [rightCol, setRightCol] = useState("");
  // const [centerRow, setCenterRow] = useState("");
  // const [centerCol, setCenterCol] = useState("");
  const [showCreating, setShowCreating] = useState(false);
  const [showName, setShowName] = useState("");
  const [showDate, setShowDate] = useState("");
  const [showTime, setShowTime] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [generatedToggle, setGeneratedToggle] = useState(true);
  const [reports, setReports] = useState([]);

  const navigate = useNavigate();

  const hideListOfShows = () => {
    setHideList(true);
    setListOfShows([]);
  };

  useEffect(() => {
    const checkLogin = (event) => {
      console.log("Checking login");
      if (event && event.key === "login") {
        const login = localStorage.getItem("login");
        if (JSON.parse(login) === false) {
          onLogout();
          navigate("/");
        }
      }
    };

    window.addEventListener("storage", checkLogin);

    return () => {
      window.removeEventListener("storage", checkLogin);
    };
  }, [navigate, onLogout]);

  const addShow = (newShow) => {
    setListOfShows((prevShows) => [...prevShows, newShow]);
  };

  async function listShows() {
    // console.log(manager.id);
    //setLoadingList(true);
    const res = await fetch(
      "https://4r6n1ud949.execute-api.us-east-2.amazonaws.com/listevents",
      {
        credentials: "include",
        method: "GET",
      }
    );

    const data = await res.json();

    setListOfShows(data.events);
    // setListOfShows([]);
    // data.events.map((event) => {
    //   // Call addShow for each event
    //   event.venue_id === selectedVenue.id &&
    //     addShow({
    //       name: event.name,
    //       date: new Date(event.date).toLocaleDateString(),
    //       time: new Date(event.date).toLocaleTimeString([], {
    //         hour: "2-digit",
    //         minute: "2-digit",
    //         hour12: false,
    //       }),
    //       id: event.id,
    //       active: event.active,
    //     });
    // });

    data.sections.forEach((section) => {
      if (section.venue_id === selectedVenue.id) {
        updateDict(section.venue_id, [section.row_count, section.col_count]);
      }
    });
  }

  const handleVenueClick = (index) => {
    console.log(venues);
    setSelectedVenue(venues[index]);
    console.log(venues[index]);
    console.log(venues);
  };

  const handleUnselectVenue = () => {
    setSelectedVenue(null);
    setSelectedShow(null);
    setListOfShows([]);
    setGeneratedToggle(true);
    setHideList(true);
  };

  async function listVenues() {
    setLoading(true);
    const res = await fetch(
      "https://4r6n1ud949.execute-api.us-east-2.amazonaws.com/listvenues",
      {
        credentials: "include",
        method: "GET",
      }
    );

    const venues = await res.json();
    console.log(venues);
    setVenues(venues);
    setLoading(false);
  }

  administrator.venues = receivedData.venues;

  const [selectedShow, setSelectedShow] = useState(null);

  const handleShowClick = (index) => {
    setSelectedShow(listOfShows[index]);
    setGeneratedToggle(true);
    listSeats(listOfShows[index].id, listOfShows[index].venue_id);
  };

  const [leftTicketPriceList, setLeftTicketPriceList] = useState([]);
  const [midTicketPriceList, setMidTicketPriceList] = useState([]);
  const [rightTicketPriceList, setRightTicketPriceList] = useState([]);
  const [legend, setLegend] = useState([]);

  async function listSeats(eventId, venueId) {
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
        if (!acc[sectionId]) { acc[sectionId] = []; }
        acc[sectionId].push(block);
        return acc;
      }, {});

      // Sort each section list by start_row
      const sortedBlocks = Object.keys(groupedBlocks).reduce((acc, sectionId) => {
        const sortedList = groupedBlocks[sectionId].sort((a, b) => a.start_row - b.start_row);
        acc.push(sortedList);
        return acc;
      }, []);

      const leftCostList = [];
      const midCostList = [];
      const rightCostList = [];

      const leftCol = getLayout(venueId, 1);
      const midCol = getLayout(venueId, 3);
      const rightCol = getLayout(venueId, 5);

      const leftBlocks = sortedBlocks[0];
      const midBlocks = sortedBlocks[1];
      const rightBlocks = sortedBlocks[2];

      const legendBlocks = []

      console.log(leftBlocks)
      console.log(midBlocks)
      console.log(rightBlocks)

      leftBlocks.forEach((block) => {
        legendBlocks.push({ color: `rgb(${randomFloatC(0, 241, block.price) + 15}, ${randomFloatC(0, 221, block.price * 20) + 35}, ${randomFloatC(0, 201, block.price * 40) + 55})`, price: `$${block.price}` });
        const numColumns = leftCol;
        for (let row = block.start_row; row <= block.end_row; row++) {
          for (let col = 1; col <= numColumns; col++) {
            leftCostList.push(block.price);
          }
        }
        console.log(leftCostList);
      });

      midBlocks.forEach((block) => {
        legendBlocks.push({ color: `rgb(${randomFloatC(0, 241, block.price) + 15}, ${randomFloatC(0, 221, block.price * 20) + 35}, ${randomFloatC(0, 201, block.price * 40) + 55})`, price: `$${block.price}` });
        const numColumns = midCol;
        for (let row = block.start_row; row <= block.end_row; row++) {
          for (let col = 1; col <= numColumns; col++) {
            midCostList.push(block.price);
          }
        }
        console.log(midCostList);
      });

      rightBlocks.forEach((block) => {
        legendBlocks.push({ color: `rgb(${randomFloatC(0, 241, block.price) + 15}, ${randomFloatC(0, 221, block.price * 20) + 35}, ${randomFloatC(0, 201, block.price * 40) + 55})`, price: `$${block.price}` });
        const numColumns = rightCol;
        for (let row = block.start_row; row <= block.end_row; row++) {
          for (let col = 1; col <= numColumns; col++) {
            rightCostList.push(block.price);
          }
        }
        console.log(rightCostList);
      });

      setLeftTicketPriceList(leftCostList);
      setMidTicketPriceList(midCostList);
      setRightTicketPriceList(rightCostList);

      const uniqueLegendBlocks = legendBlocks.reduce((unique, item) => {
        return unique.findIndex(uniqueItem => uniqueItem.color === item.color && uniqueItem.price === item.price) < 0
          ? [...unique, item]
          : unique;
      }, []);

      const sortedLegendBlocks = uniqueLegendBlocks.sort((a, b) => {
        const priceA = Number(a.price.replace('$', ''));
        const priceB = Number(b.price.replace('$', ''));
        return priceA - priceB;
      });

      setLegend(sortedLegendBlocks);

      return;
      // console.log(data);
      // console.log(data[0]);
      // console.log(data[0].price);
    } catch (error) {
      console.error("Error occurred during listing seats:", error);
    }
  }

  const handleUnselectShow = () => {
    setSelectedShow(null);
    listShows();
  };

  const handleDeleteShow = () => {
    console.log(selectedShow.id);
    deleteShowAdminC(selectedShow.id);
    setListOfShows((prevShows) =>
      prevShows.filter((show) => show !== selectedShow)
    );
    setSelectedShow(null);
    //listShows();
  };

  const activateShow = () => {
    const updatedShow = { ...selectedShow, active: 1 };
    setSelectedShow(updatedShow);
    console.log(selectedShow.id);
    selectedShow.active = 1;
    activateShowAdminC(selectedShow.id);
  };
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

  const getLayout = (venueId, num) => {
    let layout = layoutDict[venueId];
    // console.log(layoutDict[venueId]);
    let result = layout[num];
    return result;
  };

  async function createBlock() {
    try {
      await fetch(
        "https://4r6n1ud949.execute-api.us-east-2.amazonaws.com/createblocks",
        {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify([
            {
              eventId: selectedShow.id,
              sectionId: null,
              price: ticketPrice,
              startRow: null,
              endRow: null,
            },
          ]),
        }
      );

      // const data = await res.json();
      // console.log(data)
      setTicketPrice(null);
    } catch (error) {
      console.error("Error occurred during creating blocks:", error);
    }
  }
  const creatingShow = () => {
    setShowCreating(true);
  };

  const formatDateTime = (date, time) => {
    const year = Math.floor(date / 10000);
    const month = Math.floor((date % 10000) / 100);
    const day = date % 100;

    const hours = Math.floor(time / 100);
    const minutes = time % 100;

    return `${year.toString().padStart(2, "0")}-${month
      .toString()
      .padStart(2, "0")}-${day.toString().padStart(2, "0")}T${hours
        .toString()
        .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  };
  const handleDateTimeChange = (datetimeString) => {
    const selectedDate = new Date(datetimeString); // Convert string to Date object
    if (!isNaN(selectedDate)) {
      // Check if the conversion was successful
      const year = selectedDate.getFullYear(); // Extract YYYY
      const month = selectedDate.getMonth() + 1; // GetMonth is zero-based
      const day = selectedDate.getDate();

      const hours = selectedDate.getHours();
      const minutes = selectedDate.getMinutes();

      // Convert date and time
      setShowDate(year * 10000 + month * 100 + day);
      setShowTime(hours * 100 + minutes);
    }
  };

  const displayDate = (date) => {
    const year = Math.floor(date / 10000);
    const month = Math.floor((date % 10000) / 100);
    const day = date % 100;
    return `Date: Month ${month.toString().padStart(2, "0")} / Day ${day
      .toString()
      .padStart(2, "0")} / Year ${year}`;
  };

  const displayTime = (time) => {
    const hour = Math.floor(time / 100);
    const minute = time % 100;
    return `Time: ${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;
  };

  const createShow = () => {
    setSubmitLoading(true);
    const year = Math.floor(showDate / 10000);
    const month = Math.floor((showDate % 10000) / 100);
    const day = showDate % 100;
    const hours = Math.floor(showTime / 100);
    const minutes = showTime % 100;

    // Call createShowC with await if it returns a Promise
    createShowAdminC(selectedVenue.id, showName, showDate, showTime);
    // Use setTimeout to introduce a delay
    setTimeout(() => {
      setShowName("");
      setShowDate("");
      setShowTime("");
      setShowCreating(false);
      setSubmitLoading(false);
    }, 2000);

    addShow({
      name: showName,
      date: `${year}-${month}-${day}`,
      time: `${hours}:${minutes}`,
      id: selectedVenue.id,
      active: 0,
    });
  };
  const handleBackCreateShow = () => {
    setShowName("");
    setShowDate("");
    setShowTime("");
    setShowCreating(false);
    setSubmitLoading(false);
  };
  const generateShowReport = async () => {
    try {
      const res = await fetch(
        "https://4r6n1ud949.execute-api.us-east-2.amazonaws.com/generateshowsreport",
        {
          credentials: "include",
          method: "GET",
        }
      );

      const data = await res.json();
      console.log(data);

      // Convert the data into Report components
      const reportComponents = data.map((report) => (
        <Report
          key={report.event_id}
          id={report.event_id}
          name={report.event_name}
          seatsAvailable={report.available_seats}
          seatsUnavailable={report.unavailable_seats}
          totalRevenue={report.total_revenue}
        />
      ));

      reportComponents.sort((a, b) => a.key - b.key);
      setReports(reportComponents); // Update state with the generated Report components
    } catch (error) {
      console.error("Error occurred during generate show report:", error);
      setReports([]); // Set empty array if there's an error
      setGeneratedToggle(false);
    }
  };

  const handleGenerateShowsReport = () => {
    setGeneratedToggle(!generatedToggle);
    if (generatedToggle) {
      generateShowReport();
    }
  };

  const Report = ({
    id,
    name,
    seatsAvailable,
    seatsUnavailable,
    totalRevenue,
  }) => (
    <div
      style={{
        marginBottom: "10px",
        borderBottom: "1px solid black",
        paddingBottom: "10px",
      }}
    >
      <p>
        <strong>Show Name:</strong> {name}
      </p>
      <p>
        <strong>Seats Available:</strong> {seatsAvailable}
      </p>
      <p>
        <strong>Seats Unavailable:</strong> {seatsUnavailable}
      </p>
      <p>
        <strong>Total Revenue:</strong> {totalRevenue}
      </p>
      <p>
        <strong>ID:</strong> {id}
      </p>
    </div>
  );

  return (
    <div>
      <div className="center-container">
        <img
          src="/pictures/logo.png"
          alt="Logo"
          width="250"
          height="100"
          onClick={() => {
            onLogout();
            navigate("/");
          }}
          style={{ cursor: "pointer" }}
        />
      </div>
      <div>
        {loggedInUser && (
          <div style={{ position: "absolute", left: 650, top: 120 }}>
            {/* <SearchBar onSearch={handleSearch} />  */}
          </div>
        )}
      </div>

      <div>
        {loggedInUser ? (
          <div>
            <div className="upper-right-text">
              <p>
                Welcome back, {loggedInUser.role} {loggedInUser.username}! Now
                you may administrate.
              </p>
              <button
                onClick={() => {
                  onLogout();
                  navigate("/");
                }}
              >
                Logout
              </button>
              {/* <Link to="/">Customer View</Link>
              <Link to="/manager">Manager View</Link> */}
            </div>

            <div className="middle-container">
              {loading ? (
                <p>loading... </p>
              ) : (
                <div>
                  <button onClick={listVenues}>Refresh</button>
                </div>
              )}
              {venues.length ? (
                <div>
                  <div style={{ position: "absolute", left: 530, top: 200 }}>
                    {!selectedVenue && (
                      <div>
                        <h3>You have {venues.length} venues.</h3>
                        <h4>List of venues:</h4>
                      </div>
                    )}
                    <div style={{ display: "flex", flexWrap: "wrap" }}>
                      {!selectedVenue &&
                        venues.map((venue, index) => (
                          <Venue
                            key={index}
                            {...venue}
                            onClick={() => handleVenueClick(index)}
                          />
                        ))}
                    </div>
                  </div>

                  <div className="middle-container">
                    {selectedVenue && !showCreating && (
                      <div>
                        <p>
                          <strong>Selected Venue:</strong>
                        </p>
                        <p>
                          <strong>Name:</strong> {selectedVenue.name}{" "}
                          <strong>Id:</strong> {selectedVenue.id}
                        </p>
                        <button onClick={handleUnselectVenue}>
                          unselectVenue
                        </button>
                        <button onClick={handleGenerateShowsReport}>
                          generate show report
                        </button>
                        <button onClick={creatingShow}>Create show</button>
                        {!selectedShow && hideList && (
                          <button onClick={listShows}>
                            Get list of shows in this venue
                          </button>
                          // <SpecificSearchBar onSearch={handleSearch} initialSearchQuery={selectedVenue.name} />
                        )}
                        {!hideList && (
                          <button onClick={hideListOfShows}>Hide list</button>
                        )}

                        <div>
                          <div style={{ display: "flex", flexWrap: "wrap" }}>
                            {!selectedShow &&
                              listOfShows.map((show, index) => (
                                <Show
                                  key={index}
                                  name={show.name}
                                  date={new Date(
                                    show.date
                                  ).toLocaleDateString()}
                                  time={new Date(show.date).toLocaleTimeString(
                                    [],
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: false,
                                    }
                                  )}
                                  venue={selectedVenue.name}
                                  id={show.id}
                                  active={show.active}
                                  onClick={() => handleShowClick(index)}
                                />
                              ))}
                            {/* {!selectedShow && listOfShows.map((event, index) => (
                            <Show
                              key={index}
                              name={event.event_name}
                              date={new Date(event.event_date).toLocaleDateString()}
                              time={new Date(event.event_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                              venue={event.venue_name}
                              id={event.event_id}
                              active={event.event_active}
                              onClick={() => handleShowClick(index)}
                            />
                          ))} */}
                            {selectedShow && !showCreating && (
                              <div>
                                <div>
                                  <Show
                                    name={selectedShow.name}
                                    date={new Date(
                                      selectedShow.date
                                    ).toLocaleDateString()}
                                    time={new Date(
                                      selectedShow.date
                                    ).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: false,
                                    })}
                                    venue={selectedVenue.name}
                                    active={selectedShow.active}
                                    id={selectedShow.id}
                                  />
                                  <button onClick={handleUnselectShow}>
                                    unselectShow
                                  </button>
                                  {selectedShow.active === 0 && (
                                    <button onClick={activateShow}>
                                      activateShow
                                    </button>
                                  )}

                                  <button onClick={handleDeleteShow}>
                                    deleteShow
                                  </button>
                                </div>

                                <div
                                  style={{
                                    position: "absolute",
                                    right: 100,
                                    top: 100,
                                  }}
                                >
                                  <h3>Venue Layout</h3>
                                  <input
                                    type="number"
                                    value={ticketPrice}
                                    onChange={(e) =>
                                      setTicketPrice(e.target.value)
                                    }
                                    placeholder="Enter ticket price"
                                  />
                                  <p></p>
                                  <p>
                                    This ticket price will be assigned to all
                                    seats: ${ticketPrice}
                                  </p>
                                  <button onClick={createBlock}>
                                    Submit ticket price
                                  </button>
                                  <div style={{ display: "flex" }}>
                                    <Section
                                      title="Left"
                                      rows={getLayout(selectedVenue.id, 0)}
                                      cols={getLayout(selectedVenue.id, 1)}
                                      canSelect={false}
                                      ticketPriceList={leftTicketPriceList}
                                    />
                                    <Section
                                      title="Center"
                                      rows={getLayout(selectedVenue.id, 2)}
                                      cols={getLayout(selectedVenue.id, 3)}
                                      canSelect={false}
                                      ticketPriceList={midTicketPriceList}
                                    />
                                    <Section
                                      title="Right"
                                      rows={getLayout(selectedVenue.id, 4)}
                                      cols={getLayout(selectedVenue.id, 5)}
                                      canSelect={false}
                                      ticketPriceList={rightTicketPriceList}
                                    />
                                  </div>
                                  <div style={{ position: "absolute", left: 400, top: -4 }}>
                                    <h3>Pricing</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', marginTop: 20 }}>
                                      {legend.map((item, index) => (
                                        <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                                          <div style={{ width: 15, height: 15, backgroundColor: item.color }}></div>
                                          <p style={{ marginLeft: 10, marginTop: 15 }}>{item.price}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                          <div style={{ position: "relative" }}>
                            {!generatedToggle && (
                              <div style={{ marginTop: "20px" }}>
                                <h2>Your shows reports:</h2>
                                {reports.length > 0 && reports}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div>No venues yet</div>
              )}
            </div>
          </div>
        ) : (
          <div className="upper-right-text">
            <p>Logged out</p>
            <Link to="/">Go back to home page</Link>
            <p>
              Or <Link to="/login">log in</Link> again here
            </p>
          </div>
        )}
      </div>
      {selectedVenue && showCreating && (
        <div>
          <div style={{ position: "absolute", left: 100, top: 50 }}>
            {/* Form for creating a show */}
            <input
              type="text"
              value={showName}
              onChange={(e) => setShowName(e.target.value)}
              placeholder="Show Name"
            />{" "}
            <p></p>
            <input
              type="datetime-local"
              value={formatDateTime(showDate, showTime)}
              onChange={(e) => handleDateTimeChange(e.target.value)}
              placeholder="Show Date and Time"
            />
            <p>Confirm the information: </p>
            <p>Show Name: {showName}</p>
            <p>{displayDate(showDate)}</p>
            <p>{displayTime(showTime)}</p>
            <div>
              <button onClick={handleBackCreateShow}>← </button>
              <button onClick={createShow}>Submit</button>
              {submitLoading && (
                <p>Please wait, this might take some seconds...</p>
              )}
            </div>
          </div>
          <div style={{ position: "absolute", right: 100, top: 100 }}>
            <h3>Venue Layout</h3>
            <div style={{ display: "flex" }}>
              {/* Venue layout sections */}
              {/* <Section title="Left" rows={leftRow} cols={leftCol} canSelect={false} />
            <Section title="Center" rows={centerRow} cols={centerCol} canSelect={false} />
            <Section title="Right" rows={rightRow} cols={rightCol} canSelect={false} /> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminHome;
