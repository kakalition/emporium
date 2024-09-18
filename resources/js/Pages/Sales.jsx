import Common from "@/common";
import AppLayout from "@/Layouts/AppLayout";
import MainLayout from "@/Layouts/MainLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import { Button, Chip, Divider, Tooltip } from "@nextui-org/react";
import { IconStarFilled } from "@tabler/icons-react";
import moment from "moment";
import { ReactSVG } from "react-svg";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";

// const data = [
//   {
//     name: 'Page A',
//     uv: 4000,
//     pv: 2400,
//     amt: 2400,
//   },
//   {
//     name: 'Page B',
//     uv: 3000,
//     pv: 1398,
//     amt: 2210,
//   },
//   {
//     name: 'Page C',
//     uv: 2000,
//     pv: 9800,
//     amt: 2290,
//   },
//   {
//     name: 'Page D',
//     uv: 2780,
//     pv: 3908,
//     amt: 2000,
//   },
//   {
//     name: 'Page E',
//     uv: 1890,
//     pv: 4800,
//     amt: 2181,
//   },
//   {
//     name: 'Page F',
//     uv: 2390,
//     pv: 3800,
//     amt: 2500,
//   },
//   {
//     name: 'Page G',
//     uv: 3490,
//     pv: 4300,
//     amt: 2100,
//   },
// ];


function Sales({ transactions, transactionsSum }) {
  const { baseUrl } = usePage().props;
  // console.log(transactions);
  // console.log(transactionsSum);

  const data = [];

  var a = moment().subtract(27, 'days');
  var b = moment();

  for (var m = moment(a); m.diff(b, 'days') <= 0; m.add(1, 'days')) {
    const name = m.format('YYYY-MM-DD');
    data.push({
      name,
      amt: transactions.filter((e) => e.updated_at.startsWith(name)).reduce((prev, cur) => prev + parseFloat(cur.price), 0),
    });
  }

  console.log(transactions)
  console.log(data)

  function getTodaysSales() {
    return transactions.filter((e) => e.updated_at.startsWith(moment().format("YYYY-MM-DD"))).reduce((prev, cur) => prev + parseFloat(cur.price), 0);
  }

  function getLast7DaysSales() {
    return transactions.filter((e) => moment(e.updated_at).isBetween(moment().subtract(6, 'days'), moment())).reduce((prev, cur) => prev + parseFloat(cur.price), 0);
  }

  function getLast28DaysSales() {
    return transactions.reduce((prev, cur) => prev + parseFloat(cur.price), 0);
  }

  return (
    <AppLayout>
      <Head title="Sales" />

      <div className="flex flex-col justify-between h-full">
        <div className="grid grid-cols-12 gap-4 mb-20">
          <div className="rounded-xl border-2 border-gray-200 p-4 col-span-12 lg:col-span-3 flex flex-col gap-2">
            <p className="">Today's Sales</p>
            <p className="text-2xl font-semibold">Rp{Common.formatToCurrency(getTodaysSales())}</p>
          </div>
          <div className="rounded-xl border-2 border-gray-200 p-4 col-span-12 lg:col-span-3 flex flex-col gap-2">
            <p className="">Last 7 Days Sales</p>
            <p className="text-2xl font-semibold">Rp{Common.formatToCurrency(getLast7DaysSales())}</p>
          </div>
          <div className="rounded-xl border-2 border-gray-200 p-4 col-span-12 lg:col-span-3 flex flex-col gap-2">
            <p className="">Last 28 Days Sales</p>
            <p className="text-2xl font-semibold">Rp{Common.formatToCurrency(getLast28DaysSales())}</p>
          </div>
          <div className="rounded-xl border-2 border-gray-200 p-4 col-span-12 lg:col-span-3 flex flex-col gap-2">
            <p className="">Total Sales</p>
            <p className="text-2xl font-semibold">Rp{Common.formatToCurrency(transactionsSum)}</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={700}>
          <AreaChart
            data={data}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="amt" stroke="#333333" fill="#E8E8E8" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
        <div className="h-12" />
      </div>
    </AppLayout>
  )
}

export default Sales;