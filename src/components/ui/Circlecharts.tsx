import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { styled } from '@mui/material/styles';


const size = {
  width: 400,
  height: 300,
};

const StyledText = styled('text')(({ theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: 'middle',
  dominantBaseline: 'central',
  fontSize: 20,
}));

function PieCenterLabel({ children }: { children: React.ReactNode }) {
  const { width, height, left, top } = useDrawingArea();
  return (
    <StyledText x={left + width / 2} y={top + height / 2}>
      {children}
    </StyledText>
  );
}

export default function PieChartWithCenterLabel() {
  // const AllIncomeeState = useSelector((state: RootState) => state.AllIncome);
  // const salesInfo = (AllIncomeeState.data && AllIncomeeState.data.salesInfo && AllIncomeeState.data.salesInfo.length > 0)
  //   ? AllIncomeeState.data.salesInfo[0]
  //   : { total_sales: "0", cash_sales: "0", total_sales_cost: "0" };

  // const total_sales = parseFloat(salesInfo.total_sales);
  // const cash_sales = parseFloat(salesInfo.cash_sales);
  // const total_sales_cost = parseFloat(salesInfo.total_sales_cost);
  // const income = total_sales - total_sales_cost ;

  // const dispatch = useDispatch<AppDispatch>();

  // React.useEffect(() => {
  //   dispatch(GetIncomeFn());
  // }, [dispatch]);

  // const data = [
  //   { value: cash_sales, label: 'Cash Sales' },
  //   { value: total_sales_cost, label: 'Total Sales Cost' },
  //   { value: total_sales, label: 'Total Sales' },
  //   { value: income, label: 'Income' },
  // ];

  return (
    <div className='rounded-2xl gap-3 w-[98%] bg-white m-auto my-2 py-3 flex flex-col items-center'>
      <PieChart
        series={[]}
        {...size}
        // legends={{
        //   position: 'right',
        //   spacing: 20,
        //   itemHeight: 20,
        //   itemWidth: 100,
        // }}
        label={false} // Set label to false to hide the labels
      >
        <PieCenterLabel>Sale info</PieCenterLabel>
      </PieChart>
    </div>
  );
}