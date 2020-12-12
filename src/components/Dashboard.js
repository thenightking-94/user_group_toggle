import { Typography, Grid } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import CancelIcon from '@material-ui/icons/Cancel';
import SortByAlphaIcon from '@material-ui/icons/SortByAlpha';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import React, { useEffect, useRef, useState } from 'react';
import Loader from 'react-loader-spinner';
import '../css/Dash.css';

const Dashboard = () => {
    const [items, setitems] = useState([]);
    const [render_delay, setrender] = useState(true);
    const [name, setname] = useState('Default Group Name');
    const [des, setdes] = useState('Default Group description');
    const [sort, setsort] = useState(false);
    const [updategroup, setupdate] = useState(false);
    const [removal, setremoval] = useState(false);
    const timer = useRef();
    const Name = useRef();
    const Des = useRef();

    useEffect(() => {
        const promiseobj = fetch(' https://s3-ap-southeast-1.amazonaws.com/he-public-data/users49b8675.json')
        promiseobj.then(res => res.json()).then(json => setitems(json));

        timer.current = setTimeout(() => {
            setrender(false)
        }, 9000);
    }, [])


    const changeGroup = () => {
        setupdate(true)
    }
    const stopChangeGroup = () => {
        setupdate(false)
    }
    const updateRecord = () => {
        if (updategroup && Name.current.value && Des.current.value) {
            setname(Name.current.value);
            setdes(Des.current.value);
            setupdate(false)
        }
        if (updategroup && (!Name.current.value || !Des.current.value)) {
            var el = document.createElement('div');
            el.innerText = 'Please fill in the details !!';
            el.style.position = 'fixed';
            el.style.background = 'white';
            el.style.top = '300px';
            el.style.padding = '25px';
            el.style.fontFamily = 'Helvetica';
            el.style.textAlign = 'center';
            el.style.left = '45%';
            el.style.borderRadius = '10px';
            el.style.border = '3px solid #e88d14';
            document.body.appendChild(el);
            setTimeout(() => {
                el.remove();
            }, 2000);
        }
    }
    const sortData = () => {
        if (items && !sort) {
            var res = [], temp = [];
            temp = items.map(item => item.name);
            temp.sort();
            for (var i = 0; i < temp.length; i++) {
                for (var j = 0; j < items.length; j++) {
                    if (temp[i] === items[j].name)
                        res = [...res, items[j]];
                }
            }
            setitems(res);
            setsort(true);
        }
        if (items && sort) {
            var val = JSON.parse(localStorage.getItem('items'));
            if (val) {
                setitems(val);
                setsort(false)
            }

        }
    }
    const removeRecord = () => {
        if (updategroup && items) {
            var rem = [];
            var el = document.querySelectorAll("input[class='remove_items']");
            if (el) {
                for (var i = 0; i < el.length; i++) {
                    if (el[i].checked)
                        rem = [...rem, el[i].id];
                }
            }
            if (rem.length) {
                var newres = [], flag = 0;
                for (var i = 0; i < items.length; i++) {
                    flag = 0;
                    for (var j = 0; j < rem.length; j++) {
                        if (rem[j] === items[i].name)
                            flag = 1;
                    }
                    if (flag === 1)
                        continue;
                    else
                        newres = [...newres, items[i]];
                }
                if (newres.length) {
                    setitems(newres);
                    setremoval(true);
                }

            }
        }
    }
    useEffect(() => {
        if (!sort && items)
            localStorage.setItem('items', JSON.stringify(items));
    }, [items, sort])

    return (
        <div>
            {
                render_delay &&
                <Loader type="Bars" color="#e88d14" height={80} width={80} style={{ position: 'fixed', top: '40%', left: window.innerWidth > `${760}` ? '47%' : '40%' }} />
            }
            {
                !render_delay &&
                <div className='body'>
                    {!sort && < div title='click to sort'><SortByAlphaIcon onClick={sortData} id='sort_icon' /></div>}
                    {sort && <div title='click to reset'><RotateLeftIcon onClick={sortData} id='reset_icon' /></div>}
                    <div className='nav'>
                        <Typography id='header_typo'>
                            User Group
                        </Typography>
                    </div>

                    <Grid container direction='row' justify='center' alignItems='center' style={{ width: '100%', borderRadius: 'none !important' }}>
                        <div id='body_back'>

                            <div style={{ float: 'right', width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <Typography id='typo_group'>Group</Typography>
                                {!updategroup && <div title='click to update group data'><EditIcon onClick={changeGroup} id='icon' style={{ cursor: 'pointer', color: 'white' }} /></div>}
                                {updategroup && <div title='click to close'><CancelIcon onClick={stopChangeGroup} id='icon' style={{ cursor: 'pointer', color: 'white' }} /></div>}
                            </div>
                            <br />
                            <div id='group'>
                                <img src='data:image/png;base64,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'
                                    style={{ width: '100px', height: '100px', borderRadius: '10px' }} alt='group' />
                                    &nbsp;
                                <div id='data_block'>
                                    {
                                        !updategroup &&
                                        <div className='flex_adder' id='typo_group_sub'>
                                            <p>Name : &nbsp;&nbsp;</p><p id='innersub'>{name}</p>
                                        </div>
                                    }
                                    {
                                        updategroup &&
                                        <div className='flex_adder' id='typo_group_sub'>
                                            <p>Name : &nbsp;&nbsp;</p><input id='input_sub' autoComplete='off' type='text' ref={Name} placeholder='Enter name' />
                                        </div>
                                    }
                                    &nbsp;
                                    {
                                        !updategroup &&
                                        <div className='flex_adder' id='typo_group_sub'>
                                            <p>Description : &nbsp;&nbsp;</p> <p id='innersub' >{des}</p>
                                        </div>
                                    }


                                    {
                                        updategroup &&
                                        <div className='flex_adder' id='typo_group_sub'>
                                            <p>Description : &nbsp;&nbsp;</p><input id='input_sub' autoComplete='off' type='text' ref={Des} placeholder='Enter descp' />
                                        </div>
                                    }
                                </div>

                            </div>

                            <br />
                            <Grid container justify='center' style={{ boxSizing: 'border-box' }}>
                                {items && items.map(item =>
                                    <Grid key={item.Image} item md={2} xs={6} id='place_grid'>
                                        <img src={`${item.Image}`} className='img_grid' alt='grid_images' style={{ height: '150px', width: window.innerWidth > `${760}` ? (window.innerWidth - 250) / 6 : (window.innerWidth - 100) / 2 }} />
                                        <p id='para_grid'>{item.name}</p>
                                        {updategroup &&
                                            <input type='checkbox' className='remove_items' id={item.name} />}
                                        {!updategroup &&
                                            <div>&nbsp;</div>}
                                    </Grid>)}
                            </Grid>

                            {updategroup &&
                                <div className='flex_adder' style={{ marginTop: '10px' }}>
                                    <p id='updateBtn' onClick={updateRecord}>Update</p>
                                    &nbsp;&nbsp;&nbsp;
                                    {!removal && <p id='removeBtn' onClick={removeRecord}>Remove</p>}
                                </div>
                            }


                        </div>

                    </Grid>


                    <div className='flex_adder' id='footer'>
                        @&nbsp;Shubham Chatterjee
                   </div>
                </div>
            }

        </div >
    )
}

export default Dashboard;