import React, { useState, useEffect } from "react";
import "./senderpanel.css";

import PdfViewerComponent from "../PdfViewerComponent";
import axiosInstance from "../../services/AxiosInstance";
import { useParams } from "react-router-dom";

const SenderPanel = () => {
  const { id } = useParams();
  //   const id = "656491be7235cf2a1c60bb43";

  const [file, setFile] = useState();
  const [review, setReview] = useState({
    file: "",
    description: "",
    dead_line: "25/4/2028",
    comment: "",
    check_box: false,
    status: "",
  });

  const handelChange = (e) => {
    setReview({ ...review, [e.target.name]: e.target.value });
  };

  const getData = async () => {
    try {
      let response = await axiosInstance.get(`task/get-task/${id}`);
      console.log("logger", response);
      setReview({
        ...review,
        description: response?.data?.description,
        comment: response?.data?.review,
        status: response?.data?.status,
        file: response?.data?.file,
      });
    } catch (error) {}
  };
  const hideTask = async () => {
    try {
      let response = await axiosInstance.put(`task/update-task/${id}`, {
        flag: false,
      });
      console.log("logger", response);
    } catch (error) {}
  };

  useEffect(() => {
    getData();
    hideTask();
  }, []);

  return (
    <div className="reviewer_panel_main_2">
      <div className="reviewer_panel_wrapper_2">
        <div className="reviewer_panel_leftbox_2">
          {review.file != "" && <PdfViewerComponent document={review.file} />}
        </div>
        <div className="reviewer_panel_rightbox_2">
          <div className="style_heading">Your Description</div>
          <div className="style_text">{review?.description}</div>
          <div className="style_wrapper">
            <div>
              <div className="style_heading">Dead Line </div>
              <div className="style_text">{review?.dead_line}</div>
            </div>
            <div>
              <div className="style_heading">Status</div>
              <div className="style_text">{review?.status}</div>
            </div>
          </div>
          <div className="style_heading">Your Comments</div>
          <div className="style_text">
            <textarea
              disabled={true}
              defaultValue={review?.comment}
              name="comment"
              rows="10"
              className="text_area"
              onChange={(e) => handelChange(e)}
            />
          </div>

          {/* <div className="bottom_wrapper">
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
              <button style={{ marginRight: "10px" }}>Accept</button>
              <button>Need Attention</button>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default SenderPanel;
