import { connect } from "react-redux";
import SearchConsult from "../../components/SearchConsult";

function HomePage(props) {
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
