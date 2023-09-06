function fOnewayAnova(groups) {
  const groupMeans = groups.map(
    (group) => group.reduce((sum, value) => sum + value, 0) / group.length
  );
  const totalMean =
    groupMeans.reduce((sum, mean) => sum + mean, 0) / groupMeans.length;

  const betweenGroupSumOfSquares = groupMeans.reduce(
    (sum, mean, index) =>
      sum + groupMeans.length * Math.pow(mean - totalMean, 2),
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

  const betweenGroupDegreesOfFreedom = groupMeans.length - 1;
  const withinGroupDegreesOfFreedom = groups.reduce(
    (sum, group) => sum + group.length - 1,
    0
  );

  const betweenGroupMeanSquare =
    betweenGroupSumOfSquares / betweenGroupDegreesOfFreedom;
  const withinGroupMeanSquare =
    withinGroupSumOfSquares / withinGroupDegreesOfFreedom;

  const fStatistic = betweenGroupMeanSquare / withinGroupMeanSquare;

  return {
    fStatistic: fStatistic,
    betweenGroupDegreesOfFreedom: betweenGroupDegreesOfFreedom,
    withinGroupDegreesOfFreedom: withinGroupDegreesOfFreedom,
  };
}

// Example data
const group1 = [12, 15, 18, 20];
const group2 = [8, 10, 14, 16];
const group3 = [25, 30, 35, 40];

const groups = [group1, group2, group3];

const result = fOnewayAnova(groups);
console.log({ result });
