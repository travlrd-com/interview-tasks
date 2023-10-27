"use client";

export const options = {
  responsive: true,
  scales: {
    y: {
      beginAtZero: true,
      max: 50,
      ticks: {
        stepSize: 5,
        maxTicksLimit: 11,
      },
    },
    x: {
      grid: {
        display: false, // Set display to false to hide vertical grid lines
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        title: function (context: any) {
          return "Content generated"; // Change this to the desired tooltip title
        },
        label: function (context: any) {
          const label = "Content generated";
          const value = context.formattedValue;
          return label + ": " + value;
        },
      },
    },
  },

  elements: {},
};



const ContentCreatedChart = () => {
  const currentMonth = getCurrentMonth();
  const supabase = createClientComponentClient();

  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: [
      {
        label: "Dataset 1",
        data: [],
        borderColor: "rgb(0, 0, 0)",
        backgroundColor: "rgb(0, 0, 0)",
      },
    ],
  });

  useEffect(() => {
    async function fetchSavedCopiesByDay() {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonthNumber = currentDate.getMonth() + 1;

      const firstDay = new Date(currentYear, currentMonthNumber - 1, 1);
      const lastDay = new Date(currentYear, currentMonthNumber, 0);

      const dateString1 = firstDay.toISOString().split("T")[0];
      const dateString2 = lastDay.toISOString().split("T")[0];

      try {
        const { data, error } = await supabase
          .from("_saved_copies")
          .select("created_at")
          .lt("created_at", dateString2)
          .gt("created_at", dateString1)
          .order("created_at", { ascending: true });

        if (error) {
          throw error;
        }

        const daysInMonth = new Date(
          new Date().getFullYear(),
          new Date().getMonth() + 1,
          0
        ).getDate();
        const dayCounts = new Array<number>(daysInMonth).fill(0);

        data.forEach((item) => {
          const day = new Date(item.created_at).getDate();
          dayCounts[day - 1]++;
        });

        const newChartData = {
          ...chartData,
          labels: Array.from(
            { length: daysInMonth },
            (_, i) => `${currentMonth.slice(0, 3)} ${i + 1}`
          ),
          datasets: [
            {
              ...chartData.datasets[0],
              data: dayCounts,
              // borderColor: "rgb(0, 0, 0)", // Line color
              // backgroundColor: "rgb(0, 0, 0)", // Fill color
              // borderWidth: 7,
            },
          ],
        };

        setChartData(newChartData);
      } catch (error) {
        console.error("Error fetching saved copies:", error);
      }
    }

    fetchSavedCopiesByDay();
  }, [currentMonth, chartData]);

  return (
    <div className={`${classes.Content__Created__Chart} col-span-7`}>
      <div className={classes.Head}>
        <h5>Content generated in {currentMonth}</h5>
        <div className="flex items-center">
          <Image src={Ellipse} alt="ellipse" />
          <span>Content generated</span>
        </div>
      </div>
      <Line height={"50%"} options={options} data={chartData} />
    </div>
  );
};

export default ContentCreatedChart;
