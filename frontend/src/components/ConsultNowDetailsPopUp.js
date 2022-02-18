import { Dialog } from '@mui/material'
import React from 'react'


export default function ConsultNowDetailsPopUp(props) {
    const handleClose = () => {
        props.onClose();
      };
  return (
      <>
    <Dialog open={props.open} onClose={handleClose}>
        <div>ConsultNowDetailsPopUp</div>
    </Dialog>
    </>
  )
}
