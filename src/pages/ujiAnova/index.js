import {
  Box,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import CustomInput from '../../components/common/atoms/CustomInput';
import CustomButton from '../../components/common/atoms/CustomButton';
import { useDispatch, useSelector } from 'react-redux';
import { getAllDataAHP } from '../../store/ahp';
import { getAllDataMopa, getDataMopa } from '../../store/mopa';
import { getDataTopsis } from '../../store/topsis';
import { getDataSaw } from '../../store/saw';
import { changeDataAnova } from '../../store/anova';

// const dataUji = [
//   0.843267898, 0.8197365750000001, 0.608251303, 0.8207482024999999,
//   0.7758069300000001, 0.8821112425, 0.6178887875000001, 0.917665698, 0.63557285,
//   0.574572203, 0.60265471, 0.576847795, 0.8455434900000001, 0.748485383,
//   0.8255838355, 0.847929138, 0.8422562705000001, 0.866877165,
// ];

const UjiAnova = () => {
  const dispatch = useDispatch();
  const [devider, setDevider] = useState('');
  const [isDisableProses, setIsDisalbleProses] = useState(false);

  const [dataDevided, setDataDevided] = useState([]);

  const [anova, setAnova] = useState('');
  const [pValue, setPValue] = useState('');
  const ahp = useSelector(getAllDataAHP);
  const mopa = useSelector(getDataMopa);
  const topsis = useSelector(getDataTopsis);
  const saw = useSelector(getDataSaw);
  const [datas, setDatas] = useState([]);
  const [dataFix, setDataFix] = useState(null);

  useEffect(() => {
    const tempData = [
      { name: 'ahp', data: ahp },
      { name: 'mopa', data: mopa },
      { name: 'topsis', data: topsis },
      { name: 'saw', data: saw },
    ];

    setDatas(tempData);
  }, [ahp, mopa, topsis, saw]);

  useEffect(() => {
    const dividedData = Array.from({ length: devider }, (_, index) => ({
      [`data${index + 1}`]: '',
    }));

    setDataDevided(dividedData);
  }, [devider]);

  useEffect(() => {
    if (devider === '') {
      setIsDisalbleProses(true);
    } else {
      setIsDisalbleProses(false);
    }
  }, [devider]);

  const handleChange = (event, idx) => {
    const newData = [...dataDevided];
    newData[idx][`data${idx + 1}`] = Number(event.target.value);
    setDataDevided(newData);
  };

  const jStat = require('jstat');

  function fOnewayAnova(groups) {
    const groupMeans = groups.map(
      (group) => group.reduce((sum, value) => sum + value, 0) / group.length
    );
    const totalMean =
      groupMeans.reduce((sum, mean) => sum + mean, 0) / groupMeans.length;

    const betweenGroupSumOfSquares = groupMeans.reduce(
      (sum, mean, index) =>
        sum + groups[index].length * Math.pow(mean - totalMean, 2),
      0
    );

    const withinGroupSumOfSquares = groups.reduce((sum, group, index) => {
      const groupMean = groupMeans[index];
      const groupSumOfSquares = group.reduce(
        (groupSum, value) => groupSum + Math.pow(value - groupMean, 2),
        0
      );
      return sum + groupSumOfSquares;
    }, 0);

    const betweenGroupDegreesOfFreedom = groups.length - 1;
    const withinGroupDegreesOfFreedom = groups.reduce(
      (sum, group) => sum + group.length - 1,
      0
    );

    const betweenGroupMeanSquare =
      betweenGroupSumOfSquares / betweenGroupDegreesOfFreedom;
    const withinGroupMeanSquare =
      withinGroupSumOfSquares / withinGroupDegreesOfFreedom;

    const fStatistic = betweenGroupMeanSquare / withinGroupMeanSquare;

    // Calculate p-value
    const pValue =
      1 -
      jStat.centralF.cdf(
        fStatistic,
        betweenGroupDegreesOfFreedom,
        withinGroupDegreesOfFreedom
      );

    return {
      F: fStatistic,
      p_Value: pValue,
    };
  }

  const handleProses = () => {
    let startIndex = 0;

    const tempDevided = [{ data1: 7 }, { data2: 4 }, { data3: 7 }];

    const datas1 = dataDevided?.map((item) => {
      const sliceEnd = Object.values(item)[0];
      const slicedData = dataFix?.data?.slice(
        startIndex,
        startIndex + sliceEnd
      );
      startIndex += sliceEnd;
      return slicedData;
    });

    let startIndexTemp = 0;

    const datas = tempDevided.map((item) => {
      const sliceEnd = Object.values(item)[0];
      const slicedData = dataFix?.data?.slice(
        startIndexTemp,
        startIndexTemp + sliceEnd
      );
      startIndexTemp += sliceEnd;
      return slicedData;
    });

    const result =
      dataFix?.name === 'saw' || dataFix?.name === 'topsis'
        ? fOnewayAnova(datas)
        : fOnewayAnova(datas1);

    // const averages = datas.map(
    //   (data, idx) => data.reduce((acc, num) => acc + num, 0) / data.length
    // );
    // const totalAverages =
    //   averages.reduce((acc, num) => acc + num, 0) / averages.length;

    // const variants = datas.map((data, idx) =>
    //   data.map((item, index) => Math.pow(item - averages[idx], 2))
    // );

    // const totalVariants = variants.map(
    //   (data, idx) => data.reduce((acc, num) => acc + num, 0) / (data.length - 1)
    // );
    // const swa =
    //   totalVariants.reduce((acc, num) => acc + num, 0) / totalVariants.length;

    // const ssb = datas.map(
    //   (data, idx) => data.length * Math.pow(averages[idx] - totalAverages, 2)
    // );

    // const totalSsb = ssb.reduce((acc, num) => acc + num, 0) / (ssb.length - 1);

    // const f = totalSsb / swa;

    setAnova(result.F);
    setPValue(result.p_Value);
    dispatch(
      changeDataAnova({
        name: dataFix?.name,
        data: result.F,
        pValue: result.p_Value,
      })
    );
  };
  return (
    <Box>
      <Grid container columns={12} spacing={2}>
        <Grid item xs={12}>
          <Box>
            <Typography sx={{ fontWeight: 600, fontSize: '20px' }}>
              Uji Anova
            </Typography>
            <Divider />
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Typography sx={{ fontSize: '14px', mb: 1 }}>
            Silahkan pilih data yang ingin di uji
          </Typography>
          <FormControl fullWidth variant="filled">
            <InputLabel id="demo-simple-select-filled-label">
              Data Uji
            </InputLabel>
            <Select
              fullWidth
              value={dataFix}
              onChange={(e) => setDataFix(e.target.value)}
            >
              {datas?.map(
                (item, idx) =>
                  item?.data.length !== 0 && (
                    <MenuItem value={item}>{item?.name}</MenuItem>
                  )
              )}
              {/* <MenuItem value={"Benefit"}>Benefit</MenuItem> */}
            </Select>
          </FormControl>
        </Grid>

        {dataFix !== null && (
          <Grid item xs={12}>
            <CustomInput
              type="number"
              value={devider}
              // error={isErrorName}
              setValue={setDevider}
              label="Pembagi "
            />
          </Grid>
        )}

        {dataDevided?.map((item, idx) => (
          <Grid item xs={6}>
            <TextField
              type="number"
              value={item[`data${idx + 1}`]}
              variant="filled"
              onChange={(event) => handleChange(event, idx)}
              label={`Jumlah  kelompok ${idx + 1}`}
            />
          </Grid>
        ))}

        <Grid item xs={12}>
          <CustomButton
            isButtonDisabled={isDisableProses}
            title="Proses"
            color="primary"
            sx={{ fontSize: '14px', background: '#B11312', cursor: 'pointer' }}
            handleButton={handleProses}
          />
        </Grid>
        {anova !== '' && (
          <Grid item={12}>
            <Box>
              <Typography sx={{ fontWeightL: 600 }}>
                F-Statistic = {anova}
              </Typography>
              <Typography sx={{ fontWeightL: 600 }}>
                P-Value = {pValue}
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default UjiAnova;
