import React from "react";
import { connect, useDispatch } from "react-redux";

function MenuProfile({ user }) {
  const dispatch = useDispatch();

  return (
    <>
      {Object.keys(user).map((property) => (
        <h5 key={property}>
          {property} : {user[property]}
        </h5>
      ))}
    </>
  );
}
const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps)(MenuProfile);
