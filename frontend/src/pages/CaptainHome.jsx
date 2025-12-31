import React, { useRef, useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import CaptainDetails from "../components/CaptainDetails";
import RidePopUp from "../components/RidePopUp";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ConfirmRidePopUp from "../components/ConfirmRidePopUp";
import { useSocket } from "../context/SocketContext.jsx";
import { CaptainDataContext } from "../context/CaptainContext.jsx";
import axios from "axios";
import LiveTracking from "../components/LiveTracking.jsx";

const CaptainHome = () => {
  const [ridePopupPanel, setRidePopupPanel] = useState(false);
  const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);
  const [ride, setRide] = useState(null);
  const [isInfoExpanded, setIsInfoExpanded] = useState(false);
  const [showRidePeek, setShowRidePeek] = useState(false);
  const [showConfirmPeek, setShowConfirmPeek] = useState(false);
  const isOverlayOpen = ridePopupPanel || confirmRidePopupPanel;

  const ridePopupPanelRef = useRef(null);
  const confirmRidePopupPanelRef = useRef(null);
  const trackingPanelRef = useRef();

  const { socket } = useSocket();
  const { captain } = useContext(CaptainDataContext);

  useEffect(() => {
    socket.emit("join", { userType: "captain", userId: captain._id });

    const updateLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          socket.emit("update-location-captain", {
            captainId: captain._id,
            location: {
              ltd: position.coords.latitude,
              lng: position.coords.longitude,
            },
          });
        });
      }
    };

    const locationInterval = setInterval(updateLocation, 10000);
    updateLocation();

    return () => clearInterval(locationInterval);
  }, [socket, captain]);

  useEffect(() => {
    const handleNewRide = (data) => {
      console.log("New ride received:", data);
      setRide(data);
      setRidePopupPanel(true);
      setShowRidePeek(true);
    };

    socket.on("new-ride", handleNewRide);

    return () => {
      socket.off("new-ride", handleNewRide);
    };
  }, [socket]);

  useEffect(() => {
    if (isOverlayOpen) {
      setIsInfoExpanded(false);
    }
  }, [isOverlayOpen]);

  async function confirmRide() {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/confirm`,
        {
          rideId: ride._id,
          captain: captain._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setRidePopupPanel(false);
      setConfirmRidePopupPanel(true);
      setShowRidePeek(false);
      setShowConfirmPeek(true);
    } catch (error) {
      console.error("Error confirming ride:", error);
    }
  }

  useGSAP(
    function () {
      if (ridePopupPanel) {
        gsap.to(ridePopupPanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(ridePopupPanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [ridePopupPanel]
  );

  useGSAP(
    function () {
      if (confirmRidePopupPanel) {
        gsap.to(confirmRidePopupPanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(confirmRidePopupPanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [confirmRidePopupPanel]
  );

  useGSAP(
    function () {
      if (trackingPanelRef) {
        gsap.to(trackingPanelRef.current, {});
      } else {
        gsap.to(trackingPanelRef.current, {});
      }
    },
    [trackingPanelRef]
  );
  return (
    <div className="h-screen">
      <div className="fixed p-6 top-0 flex items-center justify-between w-screen z-20">
        <img
          className="w-16"
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
          alt=""
        />
        <span className="h-10 w-10" aria-hidden="true"></span>
      </div>
      <div
        className={`transition-all duration-300 ${
          isInfoExpanded || isOverlayOpen
            ? "h-0 opacity-0 pointer-events-none"
            : "h-3/5"
        }`}
        ref={trackingPanelRef}
      >
        <LiveTracking rideId={ride?._id} captainLocation={captain?.location} />
      </div>
      <div
        className={`relative p-6 transition-all duration-300 bg-white ${
          isOverlayOpen
            ? "h-2/5"
            : isInfoExpanded
            ? "h-screen pt-20 overflow-y-auto"
            : "h-2/5"
        }`}
        onClick={() => {
          if (!isOverlayOpen) {
            setIsInfoExpanded(true);
          }
        }}
      >
        {isInfoExpanded && !isOverlayOpen && (
          <button
            className="absolute top-4 right-6 z-20 h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 shadow"
            onClick={(e) => {
              e.stopPropagation();
              setIsInfoExpanded(false);
            }}
            aria-label="Collapse details"
          >
            <i className="text-xl ri-arrow-down-s-line" />
          </button>
        )}
        <CaptainDetails />
      </div>
      <div
        ref={ridePopupPanelRef}
        className="fixed w-full h-screen overflow-y-auto z-10 bottom-0 translate-y-full bg-white px-4 pb-12 pt-24"
      >
        <RidePopUp
          setRidePopupPanel={setRidePopupPanel}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
          confirmRide={confirmRide}
          ride={ride}
          trackingPanelRef={trackingPanelRef}
        />
      </div>
      <div
        ref={confirmRidePopupPanelRef}
        className="fixed w-full h-screen overflow-y-auto z-10 bottom-0 translate-y-full bg-white px-4 pb-12 pt-24"
      >
        <ConfirmRidePopUp
          ride={ride}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
          setRidePopupPanel={setRidePopupPanel}
        />
      </div>
      {showRidePeek && ride && !ridePopupPanel && !confirmRidePopupPanel && (
        <div className="fixed bottom-0 left-0 right-0 z-5 px-4 pb-6">
          <div className="bg-white shadow-xl rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">New ride available</p>
              <p className="text-sm font-semibold capitalize">
                {ride?.user?.fullname?.firstname}{" "}
                {ride?.user?.fullname?.lastname}
              </p>
              <p className="text-xs text-gray-500">Tap to reopen details</p>
            </div>
            <button
              className="text-sm font-semibold text-white bg-black px-4 py-2 rounded-lg"
              onClick={() => setRidePopupPanel(true)}
            >
              View
            </button>
          </div>
        </div>
      )}
      {showConfirmPeek && ride && !confirmRidePopupPanel && !ridePopupPanel && (
        <div className="fixed bottom-0 left-0 right-0 z-5 px-4 pb-6">
          <div className="bg-yellow-100 border-2 border-yellow-400 shadow-xl rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">
                Ride confirmed - Enter OTP
              </p>
              <p className="text-sm font-semibold capitalize">
                {ride?.user?.fullname?.firstname}{" "}
                {ride?.user?.fullname?.lastname}
              </p>
              <p className="text-xs text-gray-600">
                Tap to enter OTP and start
              </p>
            </div>
            <button
              className="text-sm font-semibold text-white bg-green-600 px-4 py-2 rounded-lg"
              onClick={() => setConfirmRidePopupPanel(true)}
            >
              Enter OTP
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaptainHome;
