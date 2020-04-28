import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { useSelector } from '../util/helpers'
import LittleSisApi from '../datasources/littlesis3.js'

const POLL_INTERVAL = 10 * 1000
const FAILURE_LIMIT = 10

export default function LockPoll() {
  const dispatch = useDispatch()
  const mapId = useSelector(state => state.attributes.id)
  const [status, setStatus] = useState('READY')
  const [failCount, setFailCount] = useState(0)

  useEffect(() => {
    if (mapId && status === 'READY') {
      setStatus('POLLING')
      console.log('Polling for lock...')

      LittleSisApi
        .lock(mapId)
        .then(json => {
          setStatus('WAITING')
          dispatch({ type: 'SET_LOCK', lock: json })
          setTimeout(() => setStatus('READY'), POLL_INTERVAL)
        })
        .catch(() => {
          setFailCount(failCount + 1)
          setStatus('WAITING')
          if (failCount > FAILURE_LIMIT) {
            console.error(`Poll HTTP request failed too many times`)
            setStatus('FAILED')
          } else {
            setTimeout(() => setStatus('READY'), POLL_INTERVAL)
          }
        })
    }
  }, [mapId, status, dispatch, failCount])

  return null
}
