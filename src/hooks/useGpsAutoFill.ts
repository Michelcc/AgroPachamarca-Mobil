import { useCallback, useEffect, useState } from "react";
import { captureGpsSnapshot, formatAlt, formatLat, formatLng, type GpsSnapshot } from "../utils/gpsService";

type CoordsSetter = {
  setLat: (v: string) => void;
  setLng: (v: string) => void;
  setAltitud?: (v: string) => void;
};

export function useGpsAutoFill(
  setters: CoordsSetter,
  options?: { autoOnMount?: boolean }
) {
  const [loading, setLoading] = useState(false);
  const [snapshot, setSnapshot] = useState<GpsSnapshot | null>(null);
  const autoOnMount = options?.autoOnMount !== false;

  const applySnapshot = useCallback(
    (snap: GpsSnapshot) => {
      setters.setLat(formatLat(snap));
      setters.setLng(formatLng(snap));
      if (setters.setAltitud) {
        const alt = formatAlt(snap);
        if (alt) setters.setAltitud(alt);
      }
      setSnapshot(snap);
    },
    [setters]
  );

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const snap = await captureGpsSnapshot();
      if (snap) applySnapshot(snap);
      return snap;
    } finally {
      setLoading(false);
    }
  }, [applySnapshot]);

  useEffect(() => {
    if (autoOnMount) void refresh();
  }, []);

  return { loading, snapshot, refresh };
}
