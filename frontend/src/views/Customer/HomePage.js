import { useEffect } from "react";

import { connect } from "react-redux";

function HomePage(props) {
  useEffect(() => {
    console.log("Home page");}, []);

  return (
    <div>
      <p>hi</p>
    </div>
  );
}

HomePage.defaultProps = {};
HomePage.propTypes = {};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, {})(HomePage);
