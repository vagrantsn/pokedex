import { fireEvent, render, screen } from '@testing-library/react'
import { QueryObserverSuccessResult } from 'react-query'

import { Bookmarks } from '.'
import { PokemonType } from '../../types/pokemon'

it('should render items without errors', () => {
  const usePokemons = (): Partial<QueryObserverSuccessResult<PokemonType[]>> => ({
    isLoading: false,
    data: [
      { id: 1, name: 'Bulbasaur', picture: '' },
      { id: 2, name: 'Ivysaur', picture: '' },
    ]
  })

  render(
    <Bookmarks
      onPokemonClick={jest.fn()}
      hooks={{ usePokemons }}
    />
  )
})

it('should call onPokemonClick with pokemon id', () => {
  const onPokemonClick = jest.fn()

  const usePokemons = (): Partial<QueryObserverSuccessResult<PokemonType[]>> => ({
    isLoading: false,
    data: [
      { id: 1, name: 'Bulbasaur', picture: '' },
      { id: 2, name: 'Ivysaur', picture: '' },
    ]
  })

  render(
    <Bookmarks
      onPokemonClick={onPokemonClick}
      hooks={{ usePokemons }}
    />
  )

  fireEvent.click(screen.getByRole('button', { name: 'Bulbasaur #001' }))

  expect(onPokemonClick).toHaveBeenCalledWith(1)
})
