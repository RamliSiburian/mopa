import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import CustomInput from '../../../components/common/atoms/CustomInput';
import { CloseIcon } from '../../../assets/icons';
import CustomButton from '../../../components/common/atoms/CustomButton';
import { createPerbandinganAhp } from '../../../config/perbandinganAhp';
import { dataPerbandingan } from '../../../components/common/dataPerbandingan';

const data = dataPerbandingan;

const AddNilaiPerbandingan = ({ openAddNilaiAhp, setOpenAddNilaiAhp }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [perbandingan, setPerbandingan] = useState(null);
  const [nilai, setNilai] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  //!   validation
  const [isErrorName, setIsErrorName] = useState(false);
  const [isErrorBobot, setIsErrorBobot] = useState(false);

  // ! handler
  const handleClose = () => {
    setOpenAddNilaiAhp(false);
  };

  const handleChange = (event) => {
    setPerbandingan(event.target.value);
  };

  const handleSave = () => {
    perbandingan === null ? setIsErrorName(true) : setIsErrorName(false);
    nilai === '' ? setIsErrorBobot(true) : setIsErrorBobot(false);

    const params = {};
    params.kode = perbandingan?.kode;
    params.deskripsi = perbandingan?.deskripsi;
    params.nilai = Number(nilai);
    const saveData = async () => {
      setIsLoading(true);
      try {
        const data = await createPerbandinganAhp(params);
        //   navigate("dashboard/data-master/kriteria", { replace: true });
        setOpenAddNilaiAhp(false);
        setIsLoading(false);
        setPerbandingan(null);
        setNilai('');
      } catch (err) {
        console.error(err);
      }
    };

    perbandingan !== null && nilai !== '' && saveData();
  };
  return (
    <Dialog open={openAddNilaiAhp} fullWidth>
      <DialogTitle>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography sx={{ fontSize: '16px', fontWeight: 600 }}>
            Add Criteria
          </Typography>
          <Typography onClick={handleClose}>
            <CloseIcon />
          </Typography>
        </Box>
      </DialogTitle>
      <Divider />

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormControl>
            <InputLabel id="select-label">Select Category</InputLabel>
            <Select
              labelId="select-label"
              id="select"
              value={perbandingan?.deskripsi}
              onChange={(e) => handleChange(e)}
            >
              {data.map((item) => (
                <MenuItem key={item.kode} value={item}>
                  {item.deskripsi}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <CustomInput
            type="number"
            value={nilai}
            setNilai
            error={isErrorBobot}
            setValue={setNilai}
            label="Weight"
          />

          {/* button */}
          <CustomButton
            handleButton={handleSave}
            title={
              isLoading ? (
                <CircularProgress size={18} sx={{ color: '#FFF' }} />
              ) : (
                'Save'
              )
            }
            sxBox={{ background: '#303030' }}
            sx={{ color: '#FFF' }}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AddNilaiPerbandingan;
