const measures: Record<string, Measure> = {};

/**
 * Measures execution time. This function requires that you pass a measurement id to be used
 * later to finish the measurement. When finishing measurement onFinishMeasurement callback
 * will be executed passing the resulting time, call finishMeasureTime with the measurementId
 * to finish the measurement.
 */
export function measureTime(props: MeasureTimeSettings) {
   const currentMeasurement = measures[props.measurementId];

   if (currentMeasurement?.finished === false) {
      return;
   }

   if (
      currentMeasurement?.props?.executeMeasurementOnlyOnce === true &&
      currentMeasurement?.lastMeasurement != null
   ) {
      return;
   }

   let timeoutId = undefined;
   if (props?.maxTimeOfMeasurementMs != null) {
      timeoutId = setTimeout(() => {
         finishMeasureTime(props.measurementId);
      }, props.maxTimeOfMeasurementMs);
   }

   measures[props.measurementId] = {
      props,
      finished: false,
      startTime: new Date().getTime(),
      timeoutId
   };
}

/**
 * Finishes the measurement and the onFinishMeasurement will be called.
 */
export function finishMeasureTime(measurementId: string) {
   const currentMeasurement = measures[measurementId];

   if (currentMeasurement == null) {
      return;
   }

   if (currentMeasurement.finished) {
      return;
   }

   const timeElapsed = new Date().getTime() - currentMeasurement.startTime;

   if (currentMeasurement.timeoutId != null) {
      clearTimeout(currentMeasurement.timeoutId);
   }

   measures[measurementId] = {
      ...currentMeasurement,
      finished: true,
      lastMeasurement: timeElapsed
   };

   currentMeasurement.props?.onFinishMeasurement?.(measurementId, timeElapsed);
}

export interface MeasureTimeSettings {
   /* Create a unique id to be used later to finish the time measurement */
   measurementId: string;
   /* This callback is the way to get the measured time */
   onFinishMeasurement: (measurementId: string, measuredTimeMs: number) => void;
   /* After this time passes the measurement callback is executed and the measurement finishes */
   maxTimeOfMeasurementMs?: number;
   /* Execute measurement only once per session */
   executeMeasurementOnlyOnce?: boolean;
}

interface Measure {
   props: MeasureTimeSettings;
   finished: boolean;
   startTime: number;
   lastMeasurement?: number;
   timeoutId: number | undefined;
}
