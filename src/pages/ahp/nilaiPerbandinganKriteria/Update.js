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
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CloseIcon } from '../../../assets/icons';
import CustomInput from '../../../components/common/atoms/CustomInput';
import CustomButton from '../../../components/common/atoms/CustomButton';
import { updateDataPerbandinganAhp } from '../../../config/perbandinganAhp';
import { changeNilaiPerbandinganAhp } from '../../../store/perbandinganAhp/updatePerbandinganAhp';
import {
  changeNilaiPerbandinganKriteriaAhp,
  getAllDataEditPerbandinganKriteriaAhp,
} from '../../../store/perbandinganKriteriaAhp/updatePerbandinganKriteriaAhp';
import { updateDataPerbandinganCriteriaAhp } from '../../../config/perbandinganKkriteriaAhp';

const UpdatePerbandinganKriteriaAhp = ({
  openUpdatePerbandinganKriteriaAhp,
  setOpenUpdatePerbandinganKriteriaAhp,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { kode, deskripsi, nilai } = useSelector(
    getAllDataEditPerbandinganKriteriaAhp
  );

  const [isLoading, setIsLoading] = useState(false);

  //!   validation
  const [isErrorNilai, setIsErrorNilai] = useState(false);

  // ! handler
  const handleClose = () => {
    setOpenUpdatePerbandinganKriteriaAhp(false);
  };

  const handleSave = () => {
    nilai === '' ? setIsErrorNilai(true) : setIsErrorNilai(false);

    const params = {};
    // params.kode = kode;
    params.nilai = Number(nilai);
    params.deskripsi = deskripsi;
    params.kode = kode;

    const saveData = async () => {
      setIsLoading(true);
      try {
        const data = await updateDataPerbandinganCriteriaAhp(kode, params);
        // navigate("/dashboard/ahp/nilaiahp", { replace: true });
        setOpenUpdatePerbandinganKriteriaAhp(false);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    nilai !== '' && saveData();
  };
  return (
    <Dialog open={openUpdatePerbandinganKriteriaAhp} fullWidth>
      <DialogTitle>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography sx={{ fontSize: '16px', fontWeight: 600 }}>
            Update Kriteria
          </Typography>
          <Typography onClick={handleClose}>
            <CloseIcon />
          </Typography>
        </Box>
      </DialogTitle>
      <Divider />

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <CustomInput value={deskripsi} disabled label={'deskripsi'} />
          <CustomInput value={kode} label={'kode'} disabled />
          <CustomInput
            isError={isErrorNilai}
            textError={'nilai tidak boleh kosong'}
            value={nilai}
            label={'nilai'}
            onChange={(e) => {
              dispatch(changeNilaiPerbandinganKriteriaAhp(e.target.value));
            }}
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
            sx={{ color: '#FFF' }}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default UpdatePerbandinganKriteriaAhp;
