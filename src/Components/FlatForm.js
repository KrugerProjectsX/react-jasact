import { Box, Button, Switch, TextField } from "@mui/material";
import { useRef } from "react";

export default function FlatForm() {
    const currentDate = new Date().toJSON().slice(0,10);
    const name = useRef('')
    const city = useRef('')
    const streetName = useRef('')
    const streetNumber = useRef(0)
    const areaSize = useRef('')
    const hasAc = useRef(false)
    const yearBuilt = useRef(0)
    const rentPrice = useRef(0)
    const dateAvailable = useRef(0)
    const handleSubmit = (e) => {
        e.preventDefault();
        //conectar con la base de datos todo esto
    }
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Box component={"form"} className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <TextField label="Name" inputRef={name} variant="outlined" fullWidth margin="normal" />
        <TextField label="City" inputRef={city} variant="outlined" fullWidth margin="normal" />
        <TextField label="Street name" inputRef={streetName} variant="outlined" fullWidth margin="normal"/>
        <TextField label="Street number" inputRef={streetNumber} variant="outlined" fullWidth margin="normal"/>
        <TextField label="Area size" type="number" inputRef={areaSize} variant="outlined" fullWidth margin="normal" />
        <TextField label="Year built" type="number" inputRef={yearBuilt} inputProps={{min: 1900, max: 2050}} variant="outlined" fullWidth margin="normal"/>
        <TextField label="Rent price" type="number" inputRef={rentPrice} variant="outlined" fullWidth margin="normal"/>
        <TextField label="Date available" type="date" defaultValue={currentDate} inputRef={dateAvailable} variant="outlined" fullWidth margin="normal"/>
        <Box><Switch inputRef={hasAc}/><label>Has A/C</label></Box>
        <Button type="submit" variant="outlined" className="w-full mt-4">
          Add Flat
        </Button>
      </Box>
    </div>
  );
}
