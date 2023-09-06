import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CustomInput from "../atoms/CustomInput";
import CustomButton from "../atoms/CustomButton";
import { CloseIcon } from "../../../assets/icons";
import { changeNameAlternatif, changeNilaiKriteria, getAllDataEditAlternatif } from "../../../store/alternatif/UpdateAlternatif";
import { updateAlternatif } from "../../../config/Alternatif";



const UpdateAlternatif = ({  openUpdateAlternatif, setOpenUpdateAlternatif }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { kode, namaAlternatif, kodeKriteria, nilai } = useSelector(
    getAllDataEditAlternatif
  );


  const [isLoading, setIsLoading] = useState(false);

  //!   validation
  const [isErrorName, setIsErrorName] = useState(false);
  const [isErrorBobot, setIsErrorBobot] = useState(false);
  const [isErrorKategori, setIsErrorKategori] = useState(false);

  // ! handler
  const handleClose = () => {
    setOpenUpdateAlternatif(false);
  };


  const saveData = async(kode, kodeKriteria, nilai) =>{
    setIsLoading(true);
    try {
      await Promise.all(nilai.map((_, idx) => updateAlternatif(kode, kodeKriteria[idx], {nilai : nilai[idx]})));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
      setOpenUpdateAlternatif(false);
      dispatch(changeNameAlternatif(""))
      dispatch(changeNilaiKriteria([]))
    }
  }
  const handleSave = () => {   
    saveData(kode, kodeKriteria, nilai);
  };
  
  return (
    <Dialog open={openUpdateAlternatif} fullWidth>
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontSize: "16px", fontWeight: 600 }}>
            Update Alternatif
          </Typography>
          <Typography onClick={handleClose}>
            <CloseIcon />
          </Typography>
        </Box>
      </DialogTitle>
      <Divider />

      <DialogContent>
      <Grid container columns={12} spacing={2}>
          <Grid item xs={12}>
            <CustomInput value={kode} disabled label={"Kode Alternatif"} />
          </Grid>

          <Grid item xs={12}>
            <CustomInput
            disabled
              isError={isErrorName}
              textError={"nama tidak boleh kosong"}
              value={namaAlternatif}
              label={"Nama Alternatif"}
              // setValue={setNamaAlternatif}
            />
          </Grid>

          {kodeKriteria?.map((item, idx) => (
            <Grid item xs={6}>
              <CustomInput
                type="number"
                // isError={isErrorName}
                // textError={"nama tidak boleh kosong"}
                value={nilai[idx]}
                label={item}
                onChange={(e) => {
                  const updatedNilaiKriteria = [...nilai];
                  updatedNilaiKriteria[idx] = e.target.value;
                  dispatch(changeNilaiKriteria(updatedNilaiKriteria))   
                }}
                
              />
            </Grid>
          ))}

          {/* button */}
          <Grid item xs={12}>
            <CustomButton
              handleButton={handleSave}
              title={
                isLoading ? (
                  <CircularProgress size={18} sx={{ color: "#FFF" }} />
                ) : (
                  "Save"
                )
              }
              sx={{ color: "#FFF", width: "100%", mt: 1 }}
            />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateAlternatif;
