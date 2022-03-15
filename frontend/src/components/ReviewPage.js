import { Paper, Typography } from "@mui/material";
import { useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Rating from "@mui/material/Rating";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import { pink, grey } from "@mui/material/colors";
import { TextField } from "@mui/material";
import { Box } from "@mui/system";
import { actionChangeStep } from "../actions/consulting.action";
import { actionGiveReview } from "../actions/customer.action";
import { Button } from "@mui/material";

const customIcons = {
  1: {
    icon: (
      <SentimentVeryDissatisfiedIcon
        style={{ width: "5rem", height: "5rem" }}
      />
    ),
    label: "Very Dissatisfied",
  },
  2: {
    icon: (
      <SentimentDissatisfiedIcon style={{ width: "5rem", height: "5rem" }} />
    ),
    label: "Dissatisfied",
  },
  3: {
    icon: <SentimentSatisfiedIcon style={{ width: "5rem", height: "5rem" }} />,
    label: "Neutral",
  },
  4: {
    icon: (
      <SentimentSatisfiedAltIcon style={{ width: "5rem", height: "5rem" }} />
    ),
    label: "Satisfied",
  },
  5: {
    icon: (
      <SentimentVerySatisfiedIcon style={{ width: "5rem", height: "5rem" }} />
    ),
    label: "Very Satisfied",
  },
};

const height = "5rem";

function IconContainer(props) {
  const { value, ...other } = props;
  return <span {...other}>{customIcons[value].icon}</span>;
}

IconContainer.propTypes = {
  value: PropTypes.number.isRequired,
};

function ReviewPage(props) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  return (
    <div>
      <Paper
        sx={{
          width: "fit-content",
          height: "fit-content",
          padding: "2rem",
          margin: "auto",
          marginTop: "5rem",
        }}
      >
        <Typography
          sx={{ fontSize: "1.25rem", color: grey[500], fontWeight: 400 }}
        >
          ความพึงพอใจของคุณ
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "stretch",
            flexDirection: "column",
          }}
        >
          <Rating
            sx={{ color: pink[100], margin: "1rem" }}
            name="highlight-selected-only"
            value={rating}
            IconContainerComponent={IconContainer}
            highlightSelectedOnly
            onChange={(event, newValue) => {
              setRating(newValue);
              //props.actionChangeStep(2);
            }}
          />
          <TextField
            sx={{ margin: "1rem" }}
            inputProps={{
              style: {
                height,
              },
            }}
            multiline
            rows={4}
            id="outlined-basic"
            label="อธิบายเพิ่มเติมเกี่ยวกับความพึงพอใจของคุณ..."
            value={comment}
            variant="outlined"
            onChange={(event, newValue) => {
              setComment(newValue);
            }}
          />
        </Box>
        <Button
          onClick={() => {
            props.actionGiveReview({
              jobID: props.jobID,
              rating: rating,
              reason: comment,
            });
            props.actionChangeStep(2);
          }}
        >
          ยืนยัน
        </Button>
      </Paper>
    </div>
  );
}

ReviewPage.defaultProps = {};
ReviewPage.propTypes = {
  actionChangeStep: PropTypes.func.isRequired,
  actionGiveReview: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, {
  actionChangeStep: actionChangeStep,
  actionGiveReview: actionGiveReview,
})(ReviewPage);
