import { useEffect, useState, useCallback } from "react";
import { connect } from "react-redux";
import * as customerService from "../../service/customer.service";
import SearchConsult from "../../components/SearchConsult";
import HomePageCard from "../../components/HomePageCard";
import { Grid } from "@mui/material";

function HomePage(props) {
  const [consultants, setConsultants] = useState([]);

  const fetchConsultantList = useCallback(async () => {
    const { data: consultantsList } = await customerService.getConsultantList();
    consultantsList.forEach((consultant) => {
      setConsultants((oldArray) => [...oldArray, consultant]);
    });
  }, []);

  useEffect(() => {
    fetchConsultantList();
  }, [fetchConsultantList]);

  return (
    <div className="section-container">
      <SearchConsult />
      <div className="grid-container-wrapper">
        <Grid container rowSpacing={5} columnSpacing={{ sm: 0, md: 6, lg: 0 }}>
          {consultants.map((consultant, index) => {
            return (
              <Grid item md={12} lg={6} xl={4}>
                <HomePageCard key={index} consultant={consultant} />
              </Grid>
            );
          })}
        </Grid>
      </div>
    </div>
  );
}

HomePage.defaultProps = {};
HomePage.propTypes = {};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, {})(HomePage);
