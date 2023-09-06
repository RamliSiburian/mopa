import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { changeBobotKriteria, changeKategoryKriteria, changeNameKriteria, getAllDataEditKriteria } from "../../store/kriteria/UpdateKriteria";
import CustomInput from "../common/atoms/CustomInput";
import { CloseIcon } from "../../assets/icons";
import CustomButton from "../common/atoms/CustomButton";
import { updateKriteria } from "../../config/Kriteria";


const UpdateKriteria = ({ openUpdateKriteria, setOpenUpdateKriteria }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { kode, namaKriteria, bobot, kategori } = useSelector(
    getAllDataEditKriteria
  );


  const [isLoading, setIsLoading] = useState(false);

  //!   validation
  const [isErrorName, setIsErrorName] = useState(false);
  const [isErrorBobot, setIsErrorBobot] = useState(false);
  const [isErrorKategori, setIsErrorKategori] = useState(false);

  // ! handler
  const handleClose = () => {
    setOpenUpdateKriteria(false);
  };

  const handleSave = () => {
    namaKriteria === "" ? setIsErrorName(true) : setIsErrorName(false);
    bobot === 0 ? setIsErrorBobot(true) : setIsErrorBobot(false);
    kategori === "" ? setIsErrorKategori(true) : setIsErrorKategori(false);

    const params = {}; 
    // params.kode = kode;
    params.bobot = Number(bobot);
    params.namaKriteria = namaKriteria;
    params.kategori = kategori;

    const saveData = async () => {
      setIsLoading(true);
      try {
        const data = await updateKriteria(kode, params);
        // navigate("/dashboard/kriteria", { replace: true });
        setOpenUpdateKriteria(false);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    namaKriteria !== "" && bobot !== 0 && kategori !== "" && saveData();
  };
  return (
    <Dialog open={openUpdateKriteria} fullWidth>
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontSize: "16px", fontWeight: 600 }}>
            Update Kriteria
          </Typography>
          <Typography onClick={handleClose}>
            <CloseIcon />
          </Typography>
        </Box>
      </DialogTitle>
      <Divider />

      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <CustomInput value={kode} disabled label={"Kode Kriteria"} />
          <CustomInput
            isError={isErrorName}
            textError={"nama tidak boleh kosong"}
            value={namaKriteria}
            label={"Nama Kriteria"}
            // setValue={dispatch(changeNameKriteria())}
            onChange={(e) => {
              dispatch(changeNameKriteria(e.target.value));
            }}
          />
          <CustomInput
            isError={isErrorBobot}
            textError={"nilai bobot harus lebih besar dari 0"}
            type="number"
            value={bobot}
            label={"Bobot Kriteria"}
            // setValue={dispatch(changeBobotKriteria())}
            onChange={(e) => {
              dispatch(changeBobotKriteria(e.target.value));
            }}
          />

          <FormControl fullWidth variant="filled" error={isErrorKategori}>
            <InputLabel id="demo-simple-select-filled-label">
              Kategori
            </InputLabel>
            <Select
              fullWidth
              value={kategori}
              onChange={(e) => dispatch(changeKategoryKriteria(e.target.value))}
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
            sx={{ color: "#FFF" }}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateKriteria;
