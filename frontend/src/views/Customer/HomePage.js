import { connect } from "react-redux";
import SearchConsult from "../../components/SearchConsult";
import HomePageCard from "../../components/HomePageCard";

function HomePage(props) {
  return (
    <div>
      <SearchConsult />
      <HomePageCard />
    </div>
  );
}

HomePage.defaultProps = {};
HomePage.propTypes = {};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, {})(HomePage);
