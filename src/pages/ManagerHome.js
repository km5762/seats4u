import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  createVenueC,
  deleteVenueC,
  createShowC,
  deleteShowC,
  activateShowC,
} from "../controller/Controller";
// import BlockCanvas from "../boundary/Boundary";
import { VenueManager } from "../model/Model";

// Seat component representing a clickable seat
const Seat = ({ row, col, onClick, selected, blocked, selectedAndBlocked }) => (
  <div
    style={{
      border: "1px solid black",
      padding: "4px",
      margin: "2px",
      cursor: "pointer",
      backgroundColor: selectedAndBlocked
        ? "red"
        : selected && !blocked
        ? "yellow" // Light blue when selected and not blocked
        : blocked && !selected
        ? "orange" // Blue when blocked and not selected
        : "white", // White when neither selected nor blocked
    }}
    onClick={() => onClick(row, col)}
  >
    {`${col}`}
  </div>
);

// Section component containing a grid of seats
const Section = ({ title, rows, cols, canSelect, show, sectionId }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [blockedSeats, setBlockedSeats] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [selectedBlock, setSelectedBlock] = useState([]);

  const [listBlocks, setListBlocks] = useState(false);

  const [ticketPrice, setTicketPrice] = useState(null);

  async function createBlock() {
    console.log("Create Block");
    console.log("Show ID");
    console.log(show);
    console.log("Section ID");
    console.log(sectionId);
    console.log("Ticket Price");
    console.log(parseInt(ticketPrice, 10));
    console.log("Selected Seats");
    console.log(selectedSeats);

    let startRow = selectedSeats[0].row - 1;
    let endRow = selectedSeats[selectedSeats.length - 1].row - 1;

    console.log("Start Row");
    console.log(startRow);
    console.log("End Row");
    console.log(endRow);

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
              eventId: show,
              sectionId: sectionId,
              price: parseInt(ticketPrice, 10),
              startRow: startRow,
              endRow: endRow,
            },
          ]),
        }
      );

      await listBlock(show);

      setTicketPrice(null);
      setSelectedSeats([]);
    } catch (error) {
      console.error("Error occurred during creating blocks:", error);
    }
  }

  const handleSeatClick = (row, col, maxCols) => {
    if (canSelect) {
      // Check if the seat is already selected
      const isSeatSelected = selectedSeats.some(
        (seat) => seat.row === row && seat.col === col
      );

      const isSeatBlocked = blockedSeats.some(
        (seat) => seat.row === row && seat.col === col
      );

      const isBlockSelected = selectedBlock.some(
        (seat) => seat.row === row && seat.col === col
      );

      if (!isSeatSelected && !isSeatBlocked) {
        for (let col = 1; col < maxCols + 1; col++) {
          setSelectedSeats((prevSeats) => [...prevSeats, { row, col }]);
        }
        setSelectedBlock([]);
      } else if (isSeatSelected && !isSeatBlocked) {
        for (let col = 1; col < maxCols + 1; col++) {
          setSelectedSeats((prevSeats) =>
            prevSeats.filter((seat) => !(seat.row === row && seat.col === col))
          );
        }
      } else if (isSeatBlocked && !isBlockSelected) {
        for (let i = 0; i < blocks.length; i++) {
          if (blocks[i].some((seat) => seat.row === row && seat.col === col)) {
            setSelectedBlock(blocks[i]);
          }
        }
        setSelectedSeats([]);
      } else {
        setSelectedBlock([]);
      }
    }
  };

  const addBlock = () => {
    if (selectedSeats.length > 0) {
      setBlockedSeats((prevSeats) => [...prevSeats, ...selectedSeats]);
      setBlocks((prevBlocks) => [...prevBlocks, selectedSeats]);
      createBlock();
    }
  };

  const deleteBlock = () => {
    if (selectedBlock.length > 0) {
      deleteBlockC();
      console.log(selectedBlock);
      setBlocks((prevBlocks) =>
        prevBlocks.filter((block) => block !== selectedBlock)
      );
      setBlockedSeats((prevSeats) =>
        prevSeats.filter(
          (seat) =>
            !selectedBlock.some(
              (selectedSeat) =>
                selectedSeat.row === seat.row && selectedSeat.col === seat.col
            )
        )
      );
      setSelectedBlock([]);
    }
  };

  const [blockDict, setBlockDict] = useState({});

  // Function to add or update a value in the dictionary
  const updateBlockDict = (key, list) => {
    setBlockDict((prevDictionary) => {
      return {
        ...prevDictionary,
        [key]: list,
      };
    });
  };

  async function listBlock(eventId) {
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

      data.blocks.map((block) => {
        let sectionID = block.section_id;
        let startROW = block.start_row;
        let endROW = block.end_row;
        let price = block.price;
        let blockID = block.id;

        let key = `${eventId}_${sectionID}_${startROW}_${endROW}`;
        updateBlockDict(key, [blockID, price]);
      });

      if (!initBlocks) {
        console.log("Listing block initially");
        data.blocks.map((block) => {
          if (block.section_id === sectionId) {
            console.log(sectionId);
            console.log(block);
            let newBlocks = [];
            for (
              let rowIndex = block.start_row;
              rowIndex <= block.end_row;
              rowIndex++
            ) {
              for (let colIndex = 0; colIndex < cols; colIndex++) {
                let row = rowIndex + 1;
                let col = colIndex + 1;
                console.log(row, col);
                setBlockedSeats((prevSeats) => [...prevSeats, { row, col }]);
                newBlocks.push({ col, row });
              }
            }
            setBlocks((prevBlocks) => [...prevBlocks, newBlocks]);
          }
        });
        setInitBlocks(true);
      }

      return;
    } catch (error) {
      console.error("Error occurred during listing seats:", error);
    }
  }

  async function deleteBlockC() {
    let startRow = selectedBlock[0].row - 1;
    let endRow = selectedBlock[selectedBlock.length - 1].row - 1;
    let key = `${show}_${sectionId}_${startRow}_${endRow}`;
    let info = blockDict[key];
    let blockId = info[0];
    console.log(key);
    console.log(blockDict);
    console.log(blockId);
    let ids = [];
    ids.push(blockId);

    try {
      console.log("payload");
      console.log(ids);
      const res = await fetch(
        "https://4r6n1ud949.execute-api.us-east-2.amazonaws.com/deleteblocks",
        {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            blockIds: ids,
          }),
        }
      );

      const blockDictCopy = { ...blockDict };
      delete blockDictCopy[key];
      setBlockDict(blockDictCopy);
    } catch (error) {
      console.error("Error occurred during creating blocks:", error);
    }
  }

  const [initBlocks, setInitBlocks] = useState(false);

  async function getInitBlocks() {
    if (!initBlocks) {
      await listBlock(show);
    }
  }

  const listBlocksC = () => {
    //listBlock(show);
    setListBlocks(true);
  };

  // useEffect(() => {
  //   console.log("USE EFFECT")
  //   getInitBlocks();
  // }, []);

  //if (canSelect){getInitBlocks();}

  return (
    <div style={{ padding: "4px" }}>
      <h4>{title}</h4>
      {!initBlocks && <button onClick={getInitBlocks}>Get Layout</button>}
      {initBlocks && (
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
                  selectedAndBlocked={selectedBlock.some(
                    (seat) =>
                      seat.row === rowIndex + 1 && seat.col === colIndex + 1
                  )}
                />
              ))}
            </>
          ))}
        </div>
      )}
      {selectedSeats.length > 0 && selectedBlock.length === 0 && (
        <div>
          <h3>Selected Seats</h3>
          {selectedSeats.map((seat, index) => (
            <p key={index}>{`Row: ${String.fromCharCode(
              64 + seat.row
            ).toUpperCase()}, Column: ${seat.col}`}</p>
          ))}
          <input
            type="number"
            value={ticketPrice}
            onChange={(e) => setTicketPrice(e.target.value)}
            placeholder="Enter ticket price"
          />
          <p></p>
          <p>
            This ticket price will be assigned to all seats in this block: $
            {ticketPrice}
          </p>
          <button onClick={addBlock}>Add block</button>
        </div>
      )}
      {selectedBlock.length > 0 && selectedSeats.length === 0 && (
        <div>
          <h3>Selected Block</h3>
          {selectedBlock.map((seat, index) => (
            <p key={index}>{`Row: ${String.fromCharCode(
              64 + seat.row
            ).toUpperCase()}, Column: ${seat.col}`}</p>
          ))}
          <button onClick={deleteBlock}>Delete block</button>
        </div>
      )}
      {initBlocks && (
        <div>
          {listBlocks ? (
            <button onClick={() => setListBlocks(false)}>Hide Blocks</button>
          ) : (
            <button onClick={listBlocksC}>List Blocks</button>
          )}
          {listBlocks &&
            blocks.length > 0 &&
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
      )}
    </div>
  );
};

// Show component representing a rectangular block
const Show = ({ name, date, time, onClick, id, active }) => (
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
      <strong>Status:</strong> {active}
    </p>
    {/* <p><strong>Date:</strong> {date.split("T")[0]}</p>
      <p><strong>Time:</strong> {date.split("T")[1].split("Z")[0]}</p> */}
    <p>
      <strong>Id:</strong> {id}
    </p>
  </div>
);

const ManagerHome = ({ loggedInUser, setLoggedInUser, onLogout }) => {
  const [manager, setManager] = React.useState(new VenueManager());

  const location = useLocation();
  const receivedData = location.state.userData;
  const navigate = useNavigate();

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

  // const [loading, setLoading] = useState(false);

  // venues
  const [venueCreated, setVenueCreated] = useState(false);
  const [venueName, setVenueName] = useState("");
  const [leftRow, setLeftRow] = useState("");
  const [leftCol, setLeftCol] = useState("");
  const [rightRow, setRightRow] = useState("");
  const [rightCol, setRightCol] = useState("");
  const [centerRow, setCenterRow] = useState("");
  const [centerCol, setCenterCol] = useState("");
  const [showCreating, setShowCreating] = useState(false);
  const [generatedToggle, setGeneratedToggle] = useState(true);
  const [showName, setShowName] = useState("");
  const [showDate, setShowDate] = useState("");
  const [showTime, setShowTime] = useState("");
  const [showNum, setShowNum] = useState(0);
  // const [initialShowCount, setInitialShowCount] = useState(0);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [ticketPrice, setTicketPrice] = useState(null);
  const [currentTicketPrice, setCurrentTicketPrice] = useState(null);
  const [blockId, setBlockId] = useState(null);
  const [reports, setReports] = useState([]);

  // useEffect(() => {
  //   const handleLogin = async () => {
  //     // Simulate login logic (you would typically perform an API call here)
  //     try {
  //       const res = await fetch(
  //         "https://4r6n1ud949.execute-api.us-east-2.amazonaws.com/signinuserbytoken",
  //         {
  //           credentials: "include",
  //           method: "GET",
  //         }
  //       );

  //       const data = await res.json();

  //       if (data && data.user) {
  //         if (data.user.role_id === 2) {
  //           if (data.venue && data.venue.length > 0) {
  //             if (data.venue.length === 1) {
  //               const singleVenue = data.venue[0];
  //               console.log("Only one venue found:", singleVenue);
  //               // Venue manager with a single venue
  //               navigate("/manager", { state: { userData: data } });
  //               localStorage.setItem("login", JSON.stringify(true));
  //               console.log(res);
  //               console.log(data);
  //             }
  //           } else {
  //             console.log("No venues found in the response");
  //             navigate("/manager", { state: { userData: data } });
  //             localStorage.setItem("login", JSON.stringify(true));
  //             console.log(res);
  //             console.log(data);
  //           }

  //           // Set the logged-in user
  //           setLoggedInUser(data.user);
  //         } else if (data.user.role_id === 1) {
  //           // Redirect to '/admin'
  //           navigate("/admin", { state: { userData: data } });
  //           setLoggedInUser(data.user);
  //           localStorage.setItem("login", JSON.stringify(true));
  //         } else {
  //           console.log("User doesn't have the required role for this action");
  //         }
  //       } else {
  //         console.log("Invalid user data or role information");
  //       }
  //     } catch (error) {
  //       console.error("Error occurred during login:", error);
  //     }
  //     // For simplicity, just set the logged-in user to the entered username
  //     // setLoggedInUser({ username, role });
  //   };

  //   const checkLogin = (event) => {
  //     console.log("Checking login");
  //     if (event && event.key === "login") {
  //       const login = localStorage.getItem("login");
  //       if (JSON.parse(login) === true) {
  //         handleLogin();
  //       } else {
  //         onLogout();
  //         navigate("/");
  //       }
  //     }
  //   };

  //   const login = localStorage.getItem("login");
  //   if (JSON.parse(login)) {
  //     handleLogin();
  //   } else {
  //     onLogout();
  //   }

  //   window.addEventListener("storage", checkLogin);

  //   return () => {
  //     window.removeEventListener("storage", checkLogin);
  //   };
  // }, [navigate, setLoggedInUser, onLogout]);

  React.useEffect(() => {
    if (
      receivedData &&
      Array.isArray(receivedData.venue) &&
      receivedData.venue.length > 0
    ) {
      const firstVenue = receivedData.venue[0];
      manager.createVenue(firstVenue.name);
      manager.addId(firstVenue.id);
      setVenueName(firstVenue.name);
      setVenueCreated(true);
    }

    listShows();
  }, [receivedData]);

  const createVenue = () => {
    setVenueCreated(true);
    createVenueC(
      manager,
      venueName,
      leftRow,
      leftCol,
      rightRow,
      rightCol,
      centerRow,
      centerCol
    );
  };

  const deleteVenue = () => {
    deleteVenueC(manager);
    setVenueCreated(false);
    setVenueName("");
    setLeftRow("");
    setLeftCol("");
    setRightRow("");
    setRightCol("");
    setCenterRow("");
    setCenterCol("");
    setShowCreating(false);
    setShowNum(0);
    console.log(manager.venue);
    onLogout();
  };

  const handleLeftRowChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value >= 0 && value <= 26) {
      setLeftRow(value);
    }
  };

  const handleLeftColChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value >= 0) {
      setLeftCol(value);
    }
  };

  const handleCenterRowChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value >= 0 && value <= 26) {
      setCenterRow(value);
    }
  };

  const handleCenterColChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value >= 0) {
      setCenterCol(value);
    }
  };

  const handleRightRowChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value >= 0 && value <= 26) {
      setRightRow(value);
    }
  };

  const handleRightColChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value >= 0) {
      setRightCol(value);
    }
  };

  // shows
  const [shows, setShows] = useState([]);
  const [selectedShow, setSelectedShow] = useState(null);

  const addShow = (newShow) => {
    setShows((prevShows) => [...prevShows, newShow]);
  };

  const [sectionID, setSectionID] = useState(null);
  const handleShowClick = (index) => {
    setSelectedShow(shows[index]);
    setGeneratedToggle(true);
    // setPriceSubmitted(false);
    listSeats(shows[index].id);
  };

  const handleUnselectShow = () => {
    // setCurrentTicketPrice(null);
    setSelectedShow(null);
  };

  const handleDeleteShow = () => {
    console.log(selectedShow.id);
    deleteShowC(manager, selectedShow);
    setShows((prevShows) => prevShows.filter((show) => show !== selectedShow));
    setSelectedShow(null);
    setShowNum((prevNum) => prevNum - 1);
  };

  const creatingShow = () => {
    setShowCreating(true);
  };

  const canActivate = async () => {
    try {

      let activation = false;

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
            eventId: selectedShow.id,
          }),
        }
      );

      const data = await res.json();

      if (data.blocks.length < 3) {
        
        activation = false;

        return activation;
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

      const leftCol = getLayout(manager.id, 1);
      const midCol = getLayout(manager.id, 3);
      const rightCol = getLayout(manager.id, 5);

      const leftBlocks = sortedBlocks[0];
      const midBlocks = sortedBlocks[1];
      const rightBlocks = sortedBlocks[2];

      let numberOfBlockedSeats = 0;

      leftBlocks.forEach((block) => {
        const numColumns = leftCol;
        for (let row =  block.start_row; row <= block.end_row; row++) {
          for (let col = 1; col <= numColumns; col++) {
            numberOfBlockedSeats++;
          }
        }
      });

      midBlocks.forEach((block) => {
        const numColumns = midCol;
        for (let row =  block.start_row; row <= block.end_row; row++) {
          for (let col = 1; col <= numColumns; col++) {
            numberOfBlockedSeats++;
          }
        }
      });

      rightBlocks.forEach((block) => {
        const numColumns = rightCol;
        for (let row =  block.start_row; row <= block.end_row; row++) {
          for (let col = 1; col <= numColumns; col++) {
            numberOfBlockedSeats++;
          }
        }
      });

      let numberOfSeats = getLayout(manager.id, 0) * getLayout(manager.id, 1) + 
                          getLayout(manager.id, 2) * getLayout(manager.id, 3) +
                          getLayout(manager.id, 4) * getLayout(manager.id, 5);

      console.log("Number of seats", numberOfSeats)
      console.log("Number of blocked seats", numberOfBlockedSeats)
      
      activation = numberOfSeats === numberOfBlockedSeats;

      console.log(activation);

      return activation;

    } catch (error) {
      console.error("Error occurred during listing seats:", error);
    }
  }

  const activateShow = async () => {

    let activation = await canActivate();

    if (activation) {
      selectedShow.active = 1;
      activateShowC(selectedShow);
      console.log(selectedShow);
      setSelectedShow(null);
    }
    else{
      console.log("You cannot activate show until all the seats belongs to a block.")
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
      // console.log(reports);
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

  const createShow = () => {
    setSubmitLoading(true);
    const year = Math.floor(showDate / 10000);
    const month = Math.floor((showDate % 10000) / 100);
    const day = showDate % 100;
    const hours = Math.floor(showTime / 100);
    const minutes = showTime % 100;

    // Call createShowC with await if it returns a Promise
    createShowC(manager, showName, showDate, showTime).then((id) => {
      // Set manager.showId after the asynchronous operation completes
      manager.showId = id;

      // Use setTimeout to introduce a delay
      setTimeout(() => {
        // Access manager.showId after the delay
        addShow({
          name: showName,
          date: `${year}-${month}-${day}`,
          time: `${hours}:${minutes}`,
          id: manager.showId,
          active: 0,
        });

        setShowName("");
        setShowDate("");
        setShowTime("");
        setShowNum((prevNum) => prevNum + 1);
        setShowCreating(false);
        setSubmitLoading(false);
        listShows();
        console.log(manager.showId);
      }, 2000);
    });
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
    let layout = layoutDict[venueId];
    //console.log(layoutDict[venueId]);
    let result = layout[num];
    return result;
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

    // setShows(data.events);
    setShows([]);
    data.events.map((event) => {
      // Call addShow for each event
      event.venue_id === manager.id &&
        addShow({
          name: event.name,
          date: new Date(event.date).toLocaleDateString(),
          time: new Date(event.date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
          id: event.id,
          active: event.active,
        });
    });

    data.sections.map((section) => {
      // Call addShow for each event
      section.venue_id === manager.id &&
        updateDict(section.venue_id, [section.row_count, section.col_count]);
    });
  }

  const [submittedPrice, setSubmittedPrice] = useState(false);

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
      setSectionID(data.seats[0].section_id);
      console.log(data.seats[0].section_id);

      if (data.blocks.length > 0 && data.blocks[0].section_id === null) {
        let price = parseInt(data.blocks[0].price, 10);
        console.log(price);
        setTicketPrice(price);
        setSubmittedPrice(true);
      } else {
        setTicketPrice(null);
        setSubmittedPrice(false);
      }

      return;
      // console.log(data);
      // console.log(data[0]);
      // console.log(data[0].price);
    } catch (error) {
      console.error("Error occurred during listing seats:", error);
    }
  }

  const handleBackCreateShow = () => {
    setShowName("");
    setShowDate("");
    setShowTime("");
    setShowCreating(false);
    setSubmitLoading(false);
  };

  const handleCurrentPrice = () => {
    listSeats(selectedShow.id);
  };

  async function createBlock() {
    // listSeats(selectedShow.id);
    // if (blockId !== null){
    //   //deleteCurrentBlock
    // }

    try {
      const res = await fetch(
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
      // setTicketPrice(null);
      setSubmittedPrice(true);
    } catch (error) {
      console.error("Error occurred during creating blocks:", error);
    }
    // setCurrentTicketPrice(null);
  }

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

      <div className="upper-right-text">
        {loggedInUser ? (
          <div>
            <p>
              Welcome back, {loggedInUser.role} {loggedInUser.username}! Now you
              may manage.
            </p>
            <button
              onClick={() => {
                onLogout();
                navigate("/");
              }}
            >
              Logout
            </button>
            {/* <Link to="/">Customer View</Link> */}
          </div>
        ) : (
          <div>
            <p>Logged out</p>
            <Link to="/">Go back to home page</Link>
            <p>
              Or <Link to="/login">log in</Link> again here
            </p>
          </div>
        )}
      </div>

      {loggedInUser && (
        <div>
          {!venueCreated ? (
            <div>
              <div style={{ position: "absolute", left: 100, top: 100 }}>
                <input
                  type="text"
                  value={venueName}
                  onChange={(e) => setVenueName(e.target.value)}
                  placeholder="Venue Name"
                />{" "}
                <p></p>
                <input
                  type="number"
                  value={leftRow}
                  onChange={handleLeftRowChange}
                  placeholder="left row number"
                />
                <p></p>
                <input
                  type="number"
                  value={leftCol}
                  onChange={handleLeftColChange}
                  placeholder="left col number"
                />
                <p></p>
                <input
                  type="number"
                  value={centerRow}
                  onChange={handleCenterRowChange}
                  placeholder="center row number"
                />
                <p></p>
                <input
                  type="number"
                  value={centerCol}
                  onChange={handleCenterColChange}
                  placeholder="center col number"
                />
                <p></p>
                <input
                  type="number"
                  value={rightRow}
                  onChange={handleRightRowChange}
                  placeholder="right row number"
                />
                <p></p>
                <input
                  type="number"
                  value={rightCol}
                  onChange={handleRightColChange}
                  placeholder="right col number"
                />
                <p></p>
                <p>Confirm the information: </p>
                <p>Venue Name: {venueName}</p> <p>Left Row: {leftRow}</p>{" "}
                <p>Left Col: {leftCol}</p> <p>Center Row: {centerRow}</p>
                <p>Center Col: {centerCol}</p> <p>Right Row: {rightRow}</p>{" "}
                <p>Right Col: {rightCol}</p>
                <button onClick={createVenue}>Submit</button>
              </div>
              <div style={{ position: "absolute", right: 100, top: 100 }}>
                <h3>Venue Layout</h3>
                <div style={{ display: "flex" }}>
                  <Section
                    title="Left"
                    rows={leftRow}
                    cols={leftCol}
                    canSelect={false}
                  />
                  <Section
                    title="Center"
                    rows={centerRow}
                    cols={centerCol}
                    canSelect={false}
                  />
                  <Section
                    title="Right"
                    rows={rightRow}
                    cols={rightCol}
                    canSelect={false}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div>
                {!showCreating ? (
                  <div>
                    <div>
                      {!selectedShow && (
                        <div
                          style={{ position: "absolute", left: 100, top: 50 }}
                        >
                          <h3>Your Venue: {venueName}</h3>
                          <h3>Your list of shows</h3>
                          <p>You have {shows.length} shows</p>
                          <button onClick={creatingShow}>Create show</button>
                          <button onClick={deleteVenue}>Delete Venue</button>
                          <button onClick={handleGenerateShowsReport}>
                            generateShowReport
                          </button>
                          <button onClick={listShows}>Refresh</button>
                        </div>
                      )}
                      <div
                        style={{ position: "absolute", left: 100, top: 250 }}
                      >
                        <div style={{ display: "flex", flexWrap: "wrap" }}>
                          {!selectedShow &&
                            shows.map((show, index) => (
                              <Show
                                key={index}
                                {...show}
                                onClick={() => handleShowClick(index)}
                              />
                            ))}
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
                      {selectedShow && (
                        <div>
                          <div
                            style={{ position: "absolute", left: 100, top: 50 }}
                          >
                            <h2>Selected Show</h2>
                            <p>
                              <strong>Show:</strong> {selectedShow.name}
                            </p>
                            <p>
                              <strong>Date:</strong> {selectedShow.date}
                            </p>
                            <p>
                              <strong>Time:</strong> {selectedShow.time}
                            </p>
                            <p>
                              <strong>Id:</strong> {selectedShow.id}
                            </p>
                            <button onClick={handleUnselectShow}>
                              unselectShow
                            </button>
                            {selectedShow.active === 0 && (
                              <button onClick={activateShow}>
                                activateShow
                              </button>
                            )}
                            {selectedShow.active === 0 && (
                              <button onClick={handleDeleteShow}>
                                deleteShow
                              </button>
                            )}
                          </div>
                          <div
                            style={{
                              position: "absolute",
                              right: 100,
                              top: 100,
                            }}
                          >
                            <h3>Venue Layout</h3>
                            {submittedPrice === false ? (
                              <div>
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
                              </div>
                            ) : (
                              <div>
                                <p>
                                  This ticket price has been assigned to all
                                  seats: ${ticketPrice}
                                </p>
                                <button>Delete current ticket price</button>
                              </div>
                            )}
                            <div style={{ display: "flex" }}>
                              <Section
                                title="Left"
                                rows={getLayout(manager.id, 0)}
                                cols={getLayout(manager.id, 1)}
                                show={selectedShow.id}
                                sectionId={sectionID}
                                canSelect={
                                  submittedPrice === false ? true : false
                                }
                              />
                              <Section
                                title="Center"
                                rows={getLayout(manager.id, 2)}
                                cols={getLayout(manager.id, 3)}
                                show={selectedShow.id}
                                sectionId={sectionID + 1}
                                canSelect={
                                  submittedPrice === false ? true : false
                                }
                              />
                              <Section
                                title="Right"
                                rows={getLayout(manager.id, 4)}
                                cols={getLayout(manager.id, 5)}
                                show={selectedShow.id}
                                sectionId={sectionID + 2}
                                canSelect={
                                  submittedPrice === false ? true : false
                                }
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ position: "absolute", left: 100, top: 50 }}>
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
                    {/* <div style={{ position: 'absolute', right: 100, top:100 }}>
                                <h3>Venue Layout</h3>
                                <div style={{ display: 'flex' }}>
                                <Section title="Left" rows={leftRow} cols={leftCol} canSelect={false}/>
                                <Section title="Center" rows={centerRow} cols={centerCol} canSelect={false}/>
                                <Section title="Right" rows={rightRow} cols={rightCol} canSelect={false}/>
                                </div>
                            </div> */}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ManagerHome;
