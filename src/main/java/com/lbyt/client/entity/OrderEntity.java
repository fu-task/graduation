package com.lbyt.client.entity;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

@Entity
@Table(name = "water_order")
public class OrderEntity implements Serializable {
	
	private static final long serialVersionUID = 2751231434154186927L;

	@Id
	@Column(name="id")
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Integer id;
	
	@Column(name="client_id")
	private Integer clientId;
	
	@Column(name="phone")
	private String phone;
	
	@Column(name="client_name")
	private String name;
	
	@Column(name="create_date")
	@Temporal(TemporalType.TIMESTAMP)
	private Date date;
	
	@Column(name="order_status")
	private String status;
	
	@Column(name="order_address")
	private String address;
	
	@Column(name="delivery_time")
	private String deliveryTime;
	
	@Column(name="delivery_date")
	@Temporal(TemporalType.TIMESTAMP)
	private Date deliveryDate;
	
	@Column(name="pay_status")
	private String payStatus;
	
	@Column(name="pay_method")
	private String payMethod;
	
	@Column(name="department")
	private String department;
	
	@Column(name="area")
	private String area;
	
	@Column(name="total")
	private Float total;
	
	@Column(name="delivery")
	private Integer deliveryId;
	
	@OneToMany(cascade={CascadeType.ALL,CascadeType.REMOVE},fetch=FetchType.EAGER)
	@JoinColumn(name="order_id")
	private List<OrderItemEntity> items;

	public String getArea() {
		return area;
	}

	public void setArea(String area) {
		this.area = area;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Integer getClientId() {
		return clientId;
	}

	public void setClientId(Integer clientId) {
		this.clientId = clientId;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getDeliveryTime() {
		return deliveryTime;
	}

	public void setDeliveryTime(String deliveryTime) {
		this.deliveryTime = deliveryTime;
	}

	public Date getDeliveryDate() {
		return deliveryDate;
	}

	public void setDeliveryDate(Date deliveryDate) {
		this.deliveryDate = deliveryDate;
	}

	public String getPayStatus() {
		return payStatus;
	}

	public void setPayStatus(String payStatus) {
		this.payStatus = payStatus;
	}

	public String getPayMethod() {
		return payMethod;
	}

	public void setPayMethod(String payMethod) {
		this.payMethod = payMethod;
	}

	public String getDepartment() {
		return department;
	}

	public void setDepartment(String department) {
		this.department = department;
	}

	public List<OrderItemEntity> getItems() {
		return items;
	}

	public void setItems(List<OrderItemEntity> items) {
		this.items = items;
	}

	public Float getTotal() {
		return total;
	}

	public void setTotal(Float total) {
		this.total = total;
	}

	public Integer getDeliveryId() {
		return deliveryId;
	}

	public void setDeliveryId(Integer deliveryId) {
		this.deliveryId = deliveryId;
	}
	
}
