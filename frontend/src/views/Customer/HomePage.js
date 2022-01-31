import { useEffect } from "react";

import { connect } from "react-redux";
import SearchConsult from "../../components/SearchConsult";

function HomePage(props) {
  useEffect(() => {
    console.log("Home page");}, []);

  return (
    <div>
      <SearchConsult />
    </div>
  );
}

HomePage.defaultProps = {};
HomePage.propTypes = {};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, {})(HomePage);
