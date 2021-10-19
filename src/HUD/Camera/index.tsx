import React, { useEffect } from "react";


//let peerConnection: RTCPeerConnection | null = null;
type CameraConnectionInfo = {
    peerConnection: RTCPeerConnection | null,
    steamid: string
}

type OfferData = {
    offer: RTCSessionDescriptionInit,
    step: number;
}


const connectionsInfo: CameraConnectionInfo[] = []


const PlayerCamera = (props: { steamid: string, roomId: string, socket: SocketIOClient.Socket, visible: boolean }) => {
    const getConnectionInfo = (steamid: string) => connectionsInfo.find(connection => connection.steamid === steamid) || null;
    const closeConnection = () => {
        const remoteVideo = document.getElementById(`remote-video-${props.steamid}`);

        //connectionInfo.steamid = '';
        const connectionInfo = getConnectionInfo(props.steamid);

        if(remoteVideo) (remoteVideo as any).srcObject = null;
        if(!connectionInfo || !connectionInfo.peerConnection) {
            initiateVideoTransmission();
            return;
        }

        connectionInfo.peerConnection.close();

        if(connectionInfo.peerConnection.iceConnectionState === 'closed') {
            connectionInfo.peerConnection = null;
            initiateVideoTransmission();
            return;
        };
    }


    const initiateVideoTransmission = () => {
        let connectionInfo = getConnectionInfo(props.steamid);
        if(!connectionInfo){
            connectionInfo = {
                steamid: props.steamid,
                peerConnection: null
            }
            connectionsInfo.push(connectionInfo);
        }
        const rtcPeerConnectionConfiguration = {
            // Server for negotiating traversing NATs when establishing peer-to-peer communication sessions
            iceServers: [{
                urls: ['stun:stun.l.google.com:19302', 'stun:stun4.l.google.com:19302']
            }]
        };
        const peerConnection = new RTCPeerConnection(rtcPeerConnectionConfiguration);
        connectionInfo.peerConnection = peerConnection;

        peerConnection.ontrack = ({ streams: [stream] }) => {
            const remoteVideo = document.getElementById(`remote-video-${props.steamid}`);
            if(!remoteVideo) return;

            (remoteVideo as any).srcObject = stream;
        }
        peerConnection.oniceconnectionstatechange = (ev) => {
            console.log('disconected', !!peerConnection)
            if(!peerConnection) return;

            const state = peerConnection.iceConnectionState;
            if(state === 'disconnected'){
                closeConnection();
            }
        }
    }

    useEffect(() => {
        initiateVideoTransmission();
        const { socket } = props;
        socket.on('offerFromPlayer', async (roomId: string, offerData: OfferData, steamid: string) => {
            const connectionInfo = getConnectionInfo(props.steamid);
            if(!connectionInfo) return;
            const { peerConnection } = connectionInfo;
            if(props.steamid !== steamid || props.roomId !== roomId || !peerConnection) return;
            console.log(props.steamid)
            
            await peerConnection.setRemoteDescription(new RTCSessionDescription(offerData.offer));
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(new RTCSessionDescription(answer));
            
            const offer = JSON.parse(JSON.stringify(answer)) as RTCSessionDescriptionInit;

            socket.emit("offerFromHUD", roomId, { offer, step: offerData.step+1 }, steamid);

        });
    }, []);

    return <React.Fragment>
        <video className="video-call-preview" autoPlay muted id={`remote-video-${props.steamid}`} style={{ opacity: props.visible ? 1 : 0.001}}></video>
    </React.Fragment>
}

export default PlayerCamera;