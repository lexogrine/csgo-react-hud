import React, { useEffect } from "react";
import { Instance, SignalData } from 'simple-peer';
const Peer = require('simple-peer');


//let peerConnection: RTCPeerConnection | null = null;
type CameraConnectionInfo = {
    peerConnection: Instance | null,
    steamid: string
}

type OfferData = {
    offer: SignalData,
}


const connectionsInfo: CameraConnectionInfo[] = []


const PlayerCamera = (props: { steamid: string, roomId: string, socket: SocketIOClient.Socket, visible: boolean }) => {
    const getConnectionInfo = (steamid: string) => connectionsInfo.find(connection => connection.steamid === steamid) || null;
    const closeConnection = () => {
        try {
            const remoteVideo = document.getElementById(`remote-video-${props.steamid}`);
    
            //connectionInfo.steamid = '';
            const connectionInfo = getConnectionInfo(props.steamid);
    
            if (remoteVideo) (remoteVideo as any).srcObject = null;
            if (!connectionInfo || !connectionInfo.peerConnection) {
                // initiateVideoTransmission();

                setTimeout(() => {
                    initiateVideoTransmission();
                }, 500)
                return;
            }
    
            connectionInfo.peerConnection.destroy();
    
            connectionInfo.peerConnection = null;
            return;
        } catch {

        }

    }


    const initiateVideoTransmission = () => {
        const { socket, roomId, steamid } = props;

        let connectionInfo = getConnectionInfo(props.steamid);
        if (!connectionInfo) {
            connectionInfo = {
                steamid: props.steamid,
                peerConnection: null
            }
            connectionsInfo.push(connectionInfo);
        }
        const peerConnection: Instance = new Peer({ initiator: false, trickle: false });
        connectionInfo.peerConnection = peerConnection;

        peerConnection.on('signal', answer => {
            const offer = JSON.parse(JSON.stringify(answer)) as RTCSessionDescriptionInit;
            socket.emit("offerFromHUD", roomId, { offer }, steamid);

        });

        peerConnection.on('error', (err) => {
            console.log(err)
            closeConnection();
        })

        peerConnection.on('stream', stream => {
            const remoteVideo = document.getElementById(`remote-video-${props.steamid}`) as HTMLVideoElement;

            if (!remoteVideo) return;

            remoteVideo.srcObject = stream;

            remoteVideo.play()
        });

        peerConnection.on('close', () => {
            if (!peerConnection) return;

            closeConnection();
        });

    }

    useEffect(() => {
        initiateVideoTransmission();
        const { socket } = props;
        socket.on('offerFromPlayer', async (roomId: string, offerData: OfferData, steamid: string) => {
            const connectionInfo = getConnectionInfo(props.steamid);
            if (!connectionInfo) return;
            const { peerConnection } = connectionInfo;
            if (props.steamid !== steamid || props.roomId !== roomId || !peerConnection) return;
            
            peerConnection.signal(offerData.offer)

        });
    }, []);

    return <React.Fragment>
        <video className="video-call-preview" autoPlay muted id={`remote-video-${props.steamid}`} style={{ opacity: props.visible ? 1 : 0.001 }}></video>
    </React.Fragment>
}

export default PlayerCamera;