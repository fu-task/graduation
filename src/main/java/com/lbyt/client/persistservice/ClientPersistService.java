package com.lbyt.client.persistservice;

import java.util.List;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Path;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.lbyt.client.dao.IClientDao;
import com.lbyt.client.entity.ClientEntity;

@Repository
public class ClientPersistService {
	@Autowired
	private IClientDao clientDao;
	
	@Transactional(propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
	public void save(List<ClientEntity> list) {
		for (ClientEntity entity : list) {
			save(entity);
		}
	}
	
	@Transactional
	public void save(ClientEntity entity) {
		clientDao.save(entity);
	}
	
	@Transactional(propagation = Propagation.SUPPORTS)
	public List<ClientEntity> findAll() {
		return clientDao.findAll();
	}
	
	@Transactional(propagation = Propagation.SUPPORTS)
	public List<ClientEntity> findByProvAndCityAndShopState(final ClientEntity entity) {
		return clientDao.findAll(new Specification<ClientEntity>(){

			@Override
			public Predicate toPredicate(Root<ClientEntity> root,
					CriteriaQuery<?> query, CriteriaBuilder cb) {
				Path<String> prov = root.get("prov");
				Path<String> city = root.get("city");
				Path<String> state = root.get("shopState");
				Predicate predicate = null;
 				return predicate;
			}
			
		});
	}

	@Transactional
	public void deleteById(ClientEntity entity) {
		clientDao.deleteById(entity.getId());
	}
	
	@Transactional(propagation = Propagation.SUPPORTS)
	public ClientEntity findById(ClientEntity entity){
		return clientDao.findById(entity.getId());
	}
	
	@Transactional(propagation = Propagation.SUPPORTS)
	public List<ClientEntity> findByRegistName(ClientEntity entity){
		return clientDao.findByRegistName(entity.getRegistName());
	}
	
}
