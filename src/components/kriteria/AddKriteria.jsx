import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllDatakriteriaState } from '../../store/kriteria/KriteriaDatas';
import { createKriteria } from '../../config/Kriteria';
import { Box, CircularProgress, Dialog, DialogContent, DialogTitle, Divider, FormControl, FormHelperText, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { CloseIcon } from '../../assets/icons';
import CustomInput from '../common/atoms/CustomInput';
import CustomButton from '../common/atoms/CustomButton';

const AddKriteria = ({ openAddKriteria, setOpenAddKriteria }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
  
    const { nextCode } = useSelector(getAllDatakriteriaState);
    const [namaKriteria, setNamaKriteria] = useState("");
    const [bobotKriteria, setBobotKriteria] = useState("");
    const [kategori, setKategori] = useState("");
    const [isLoading, setIsLoading] = useState(false);
  
    //!   validation
    const [isErrorName, setIsErrorName] = useState(false);
    const [isErrorBobot, setIsErrorBobot] = useState(false);
    const [isErrorKategori, setIsErrorKategori] = useState(false);
  
    // ! handler 
    const handleClose = () => {
      setOpenAddKriteria(false);
    };
  
    const handleSave = () => {
      namaKriteria === "" ? setIsErrorName(true) : setIsErrorName(false);
      bobotKriteria === "" ? setIsErrorBobot(true) : setIsErrorBobot(false);
      kategori === "" ? setIsErrorKategori(true) : setIsErrorKategori(false);
  
      const params = {};
      // params.kode = nextCode;
      params.Bobot = Number(bobotKriteria);
      params.NamaKriteria = namaKriteria;
      params.Kategori = kategori;
  
      const saveData = async () => {
        setIsLoading(true);
        try {
          const data = await createKriteria(params);
        //   navigate("dashboard/data-master/kriteria", { replace: true });
          setOpenAddKriteria(false);
          setIsLoading(false);
          setNamaKriteria("");
          setBobotKriteria("");
          setKategori("");
        } catch (err) {
          console.error(err);
        }
      };
  
      namaKriteria !== "" &&
        bobotKriteria !== "" &&
        kategori !== "" &&
        saveData();
    };
    return (
      <Dialog open={openAddKriteria} fullWidth>
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography sx={{ fontSize: "16px", fontWeight: 600 }}>
              Add Kriteria
            </Typography>
            <Typography onClick={handleClose}>
              <CloseIcon />
            </Typography>
          </Box>
        </DialogTitle>
        <Divider />
  
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <CustomInput disabled value={nextCode}  label="kode" />
            <CustomInput value={namaKriteria}  error={isErrorName} setValue={setNamaKriteria} label="nama " />
            <CustomInput type="number" value={bobotKriteria}  error={isErrorBobot} setValue={setBobotKriteria} label="bobot " />


  
            <FormControl fullWidth variant="filled" error={isErrorKategori}>
              <InputLabel id="demo-simple-select-filled-label">
                Kategori
              </InputLabel>
              <Select
                fullWidth
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
              >
                <MenuItem value={"Cost"}>Cost</MenuItem>
                <MenuItem value={"Benefit"}>Benefit</MenuItem>
              </Select>
              {isErrorKategori && (
                <FormHelperText sx={{ color: "#F33A3A" }}>
                  pilih salah satu kategori
                </FormHelperText>
              )}
            </FormControl>
  
            {/* button */}
            <CustomButton
              handleButton={handleSave}
              title={
                isLoading ? (
                  <CircularProgress size={18} sx={{ color: "#FFF" }} />
                ) : (
                  "Save"
                )
              }
              sxBox={{ background: "#303030" }}
              sx={{ color: "#FFF" }}
            />
          </Box>
        </DialogContent>
      </Dialog>
    );
  };

export default AddKriteria