import { type Series } from "../../Types/Types"


type SeriesEditDetailsProps = {
    series: Series
    setAllSeries: React.Dispatch<React.SetStateAction<Series[]>>
    setSeriesEditContainer: React.Dispatch<React.SetStateAction<{
        series: Series,
        position: {
            top: number,
            left: number
        }
    } | null>>
}

//TODO: complete this component - enjoy :)
// render episodes inside each series rather than on the main list
// create a form to edit the details or images of the series
// create a button to delete the entire series or maybe to delete an individual season?
// use the previous MovieEditDetails form to edit the episodes once clicked

export const SeriesEditDetails: React.FC<SeriesEditDetailsProps> = ({series, setAllSeries, setSeriesEditContainer}) => {

    return (
        <>
        </>
    )

}

export default SeriesEditDetails