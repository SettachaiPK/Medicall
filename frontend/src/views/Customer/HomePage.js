import { useEffect, useState, useCallback } from "react";
import { connect } from "react-redux";
import * as customerService from "../../service/customer.service";
import SearchConsult from "../../components/SearchConsult";
import HomePageCard from "../../components/HomePageCard";

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
    <div>
      <SearchConsult />
      {consultants.map((consultant, index) => {
        return <HomePageCard key={index} consultant={consultant} />;
      })}
    </div>
  );
}

HomePage.defaultProps = {};
HomePage.propTypes = {};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, {})(HomePage);
