import React, { useState, useEffect } from "react";
import "./reviewerpanel.css";
import axios from "axios";

import PdfViewerComponent from "../PdfViewerComponent";
import axiosInstance from "../../services/AxiosInstance";
import { useParams } from "react-router-dom";

const ReviewerPanel = () => {
  const { id } = useParams();
  // const id = "656491be7235cf2a1c60bb43";
  const [file, setFile] = useState();
  const [review, setReview] = useState({
    file: "",
    description: "",
    dead_line: "",
    Status: "pending",
    comment: "",
    check_box: false,
  });
  const handelChange = (e) => {
    setReview({ ...review, [e.target.name]: e.target.value });
  };
  const convertUrlToFileInput = (url) => {
    fetch(url)
      .then((response) => console.log("logger1", response))
      // .then((blob) => {
      //   // const file = new File([blob], "pdf.pdf", { type: "application/pdf" });
      //   // console.log("file", file);
      //   // const syntheticEvent = {
      //   //   target: {
      //   //     files: [file],
      //   //   },
      //   // };
      //   // fileInputRef.current.dispatchEvent(new Event("change", syntheticEvent));
      // })
      .catch((error) => {
        console.error("Error converting URL to file:", error);
      });
  };

  // const getData = async () => {
  //   try {
  //     let response = await axios.get(
  //       `http://localhost:6002/task/get-task/${id}`
  //     );
  //     // let response = await axiosInstance.get(`task/get-task/${id}`);
  //     // let convertedFile = await convertUrlToFileInput(
  //     //   "https://reviewpdf2.s3.ap-southeast-2.amazonaws.com/pdf.pdf"
  //     // );
  //     // console.log("logger", convertedFile);
  //     setReview({
  //       ...review,
  //       description: response?.data?.description,
  //       dead_line: "Left",
  //       file: response?.data?.file,
  //     });
  //   } catch (error) {}
  // };
  useEffect(() => {
    // getData();
    // convertUrlToFileInput(
    //   "https://reviewpdf2.s3.ap-southeast-2.amazonaws.com/pdf.pdf"
    // );
  }, []);
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handelSubmit = async () => {
    try {
      const data = new FormData();
      data.append("comment", review?.comment);
      data.append("file", file);
      let response = await axiosInstance.put(`task/add-review/${id}`, data);
      // let response = await axiosInstance.get(`task/get-task/${id}`);
      console.log("logger", response);
      alert("review added successfully");
    } catch (error) {}
  };

  return (
    <div className="reviewer_panel_main_2">
      <div className="reviewer_panel_wrapper_2">
        <div className="reviewer_panel_leftbox_2">
          {/* {review.file != "" && ( */}
          {/* <PdfViewerComponent
            document={
              // "https://reviewpdf2.s3.ap-southeast-2.amazonaws.com/pdf.pdf"
              "https://www.africau.edu/images/default/sample.pdf"
            }
          /> */}
          {/* )} */}
        </div>
        <div className="reviewer_panel_rightbox_2">
          <div className="style_heading">Description From sender</div>
          <div className="style_text">{review?.description}</div>
          <div className="style_wrapper">
            <div>
              <div className="style_heading">Dead Line </div>
              <div className="style_text">{review?.dead_line}</div>
            </div>
            <div>
              <div className="style_heading">Status</div>
              <div className="style_text">{review?.Status}</div>
            </div>
          </div>
          <div className="style_heading">Add Your Comments</div>
          <div className="style_text">
            <textarea
              name="comment"
              rows="10"
              className="text_area"
              onChange={(e) => handelChange(e)}
            />
          </div>
          <div className="style_heading">Upload Modified PDF file</div>
          <div className="bottom_wrapper">
            (perform some action and down the file and upload here)
          </div>
          <div
            className="bottom_wrapper"
            style={{ marginTop: "10px", marginBottom: "10px" }}
          >
            <input type="file" onChange={(e) => handleFileChange(e)} />
          </div>
          <div className="bottom_wrapper">
            <div>
              <input
                type="checkbox"
                value={review.check_box}
                onChange={(e) =>
                  handelChange({
                    target: {
                      name: "check_box",
                      value: !review?.check_box,
                    },
                  })
                }
              />
              <span style={{ marginLeft: "5px", fontSize: "14px" }}>
                No comments,looks good to me
              </span>
            </div>
            <div>
              <button
                style={{ marginRight: "10px" }}
                className="button_style"
                disabled={!review.check_box}
                onClick={() => handelSubmit()}
              >
                Accept
              </button>
              <button className="button_style" style={{ background: "red" }}>
                Need Attention
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewerPanel;
